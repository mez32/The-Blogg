import React, { useState } from "react";
import { Form, Formik } from "formik";
import Head from "next/head";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/router";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { type GetServerSideProps } from "next";
import ErrorPage from "next/error";

interface Errors {
  name?: string;
}

interface FormValues {
  name: string;
}

interface PageProps {
  name: string;
}

const UserAccount = ({ name }: PageProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [error, setError] = useState<boolean>(false);

  const submitForm = async (values: FormValues): Promise<void> => {
    const body = { userId: session?.user!.id, ...values };

    try {
      const response = await axios.patch("/api/user/update", body);
      if (response.status === 200) {
        router.push("/");
      }
    } catch (error) {
      setError(true);
    }
  };

  if (!router.isFallback && !name) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
      <Head>
        <title>The Blogg - Update Account</title>
        <meta
          name="description"
          content="The Blogg - A place to have your thoughts seen"
        />
      </Head>
      <main>
        <div className="align-center mt-2 flex justify-center p-6">
          <div className="max-w-2lg block w-full rounded-lg bg-gray p-8 shadow-2xl md:max-w-3xl">
            <h2 className="text-center text-3xl">Update Your Account</h2>
            <Formik
              initialValues={{ name: name }}
              validate={(values) => {
                const errors: Errors = {};
                if (!values.name) {
                  errors.name = "Name is required";
                }
                return errors;
              }}
              onSubmit={(values): Promise<void> => {
                return submitForm(values);
              }}
            >
              {({
                handleBlur,
                errors,
                touched,
                dirty,
                isValid,
                values,
                handleChange,
              }): React.ReactElement => (
                <Form className="mb-4 px-8 pt-6 pb-8">
                  <div className="mb4">
                    <label className="block text-2xl" htmlFor="title">
                      Name
                    </label>
                    <input
                      className={`text-gray-700 focus:shadow-outline block w-full appearance-none rounded py-2 px-3 leading-tight shadow focus:outline-none ${
                        errors.name && touched.name ? "form-error" : "border"
                      }`}
                      type="text"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.name && touched.name && (
                      <div className="error-text">Name Required</div>
                    )}
                  </div>
                  <div className="mt-4 text-center">
                    <button
                      className="login-btn"
                      type="submit"
                      disabled={!isValid || !dirty}
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push("/")}
                      className="cancel-btn m-2 rounded-lg border p-2"
                    >
                      Cancel
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      name: session.user!.name,
    },
  };
};

export default UserAccount;
