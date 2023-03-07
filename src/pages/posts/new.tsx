import React, { useState } from "react";
import { Formik, Form } from "formik";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";

interface Errors {
  title?: string;
  content?: string;
}

interface FormValues {
  title: string;
  content: string;
}

const NewPost = () => {
  const router = useRouter();
  const [error, setError] = useState<boolean>(false);
  const { data: session } = useSession();

  const initialFormValues = {
    title: "",
    content: "",
  };

  const submitForm = async (values: FormValues): Promise<void> => {
    const body = { userId: session?.user?.id, ...values };

    try {
      const response = await axios.post("/api/posts/new", body);
      if (response.status === 201) {
        router.push("/");
      }
    } catch (error) {
      setError(true);
    }
  };

  return (
    <>
      <Head>
        <title>The Blogg - Create a New Post</title>
        <meta
          name="description"
          content="The Blogg - A place to have your thoughts seen"
        />
      </Head>
      <main>
        <div className="align-center mt-2 flex justify-center p-6">
          <div className="max-w-2lg block w-full rounded-lg bg-gray-900 p-8 shadow-2xl md:max-w-3xl">
            <h2 className="text-center text-3xl">Start your new post here</h2>
            <Formik
              initialValues={initialFormValues}
              validate={(values) => {
                const errors: Errors = {};
                if (!values.title) {
                  errors.title = " Title is required";
                }
                if (!values.content) {
                  errors.content = "Content is required";
                }
                return errors;
              }}
              onSubmit={(values): Promise<void> => submitForm(values)}
            >
              {({
                handleBlur,
                setFieldValue,
                errors,
                touched,
                dirty,
                isValid,
              }): React.ReactElement => (
                <Form className="mb-4 px-8 pt-6 pb-8">
                  <div className="mb4">
                    <label className="block text-2xl" htmlFor="title">
                      Title
                    </label>
                    <input
                      className={`focus:shadow-outline block w-full appearance-none rounded bg-gray-200 py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none ${
                        errors.title && touched.title
                          ? "border border-red-700 "
                          : "border"
                      }`}
                      type="text"
                      name="title"
                      placeholder="Title"
                      onChange={(
                        e: React.ChangeEvent<HTMLInputElement>
                      ): void => setFieldValue("title", e.target.value)}
                      onBlur={handleBlur}
                    />
                    {errors.title && touched.title && (
                      <div className="text-red-700">{errors.title}</div>
                    )}
                  </div>
                  <div className="mt-4">
                    <label className="block text-2xl" htmlFor="content">
                      Content
                    </label>
                    <textarea
                      className={`focus:shadow-outline block h-64 w-full appearance-none rounded bg-gray-200 py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none ${
                        errors.content && touched.content
                          ? "border border-red-700"
                          : "border"
                      }`}
                      name="content"
                      placeholder="Add your post content here..."
                      onChange={(
                        e: React.ChangeEvent<HTMLTextAreaElement>
                      ): void => setFieldValue("content", e.target.value)}
                      onBlur={handleBlur}
                    />
                    {errors.content && touched.content && (
                      <div className="text-red-700">{errors.content}</div>
                    )}
                  </div>
                  <div className="mt-4 text-center">
                    <button
                      className="btn m-2 cursor-pointer rounded-lg border border-gray-200 bg-purple-700 p-2 hover:border-gray-300 hover:bg-purple-800 hover:text-gray-300 active:scale-90"
                      type="submit"
                      disabled={!isValid || !dirty}
                    >
                      Post Blogg
                    </button>
                    <button
                      className="m-2 rounded-lg border border-gray-200 p-2 hover:border-gray-400 hover:text-gray-400 active:scale-90"
                      onClick={() => router.push("/")}
                      type="button"
                    >
                      Cancel
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
            {error && (
              <div className="error-text mt-4 text-center">
                There was an error submitting your post
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default NewPost;
