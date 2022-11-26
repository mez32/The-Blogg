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
    const body = { userId: session?.user!.id, ...values };

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
          <div className="max-w-2lg block w-full rounded-lg bg-gray p-8 shadow-2xl md:max-w-3xl">
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
                      className={`text-gray-700 focus:shadow-outline block w-full appearance-none rounded py-2 px-3 leading-tight shadow focus:outline-none ${
                        errors.title && touched.title ? "form-error" : "border"
                      }`}
                      type="text"
                      name="title"
                      placeholder="Title"
                      onChange={(e: any): void =>
                        setFieldValue("title", e?.target?.value)
                      }
                      onBlur={handleBlur}
                    />
                    {errors.title && touched.title && (
                      <div className="error-text">{errors.title}</div>
                    )}
                  </div>
                  <div className="mt-4">
                    <label className="block text-2xl" htmlFor="content">
                      Content
                    </label>
                    <textarea
                      className={`text-gray-700 focus:shadow-outline block h-64 w-full appearance-none rounded py-2 px-3 leading-tight shadow focus:outline-none ${
                        errors.content && touched.content
                          ? "form-error"
                          : "border-red-600"
                      }`}
                      name="content"
                      placeholder="Add your post content here..."
                      onChange={(e): void =>
                        setFieldValue("content", e?.target?.value)
                      }
                      onBlur={handleBlur}
                    />
                    {errors.content && touched.content && (
                      <div className="error-text">{errors.content}</div>
                    )}
                  </div>
                  <div className="mt-4 text-center">
                    <button
                      className="login-btn"
                      type="submit"
                      disabled={!isValid || !dirty}
                    >
                      Post Blogg
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
            {error && (
              <div className="error-text mt-4 text-center">
                There was an error submiting your post
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default NewPost;
