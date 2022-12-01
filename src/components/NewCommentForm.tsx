import React, { useState } from "react";
import axios from "axios";
import { Form, Formik } from "formik";
import { type Comment } from "../types/post";

interface Errors {
  comment?: string;
}

interface FormProps {
  id: string;
  userId: string | undefined;
  setComments: (comments: Comment[]) => void;
  setCommentsCount: (value: number) => void;
  closeFunc: () => void;
  openFunc: (value?: boolean) => void;
}

const NewCommentForm = ({
  id,
  userId,
  closeFunc,
  openFunc,
  setComments,
  setCommentsCount,
}: FormProps) => {
  const [error, setError] = useState("");

  const submitHandler = async (values: { comment: string }) => {
    if (!userId) {
      return;
    }

    const body = {
      postId: id,
      userId,
      content: values.comment,
    };

    try {
      const res = await axios.post("/api/posts/new-comment", body);
      if (res.status === 201) {
        const comments = await axios.get(`/api/comments/${id}`);
        setComments(comments.data);
        setCommentsCount(comments.data.length);
        closeFunc();
        openFunc(true);
      }
    } catch (error) {
      setError("There was an error posting your comment");
    }
  };

  return (
    <div className="m-2 flex">
      <div className="block w-full rounded-lg border p-3 shadow-xl">
        <Formik
          initialValues={{ comment: "" }}
          onSubmit={(values): Promise<void> => submitHandler(values)}
          validate={(values) => {
            const errors: Errors = {};
            if (!values.comment) {
              errors.comment = "Comment needed";
            }
            return errors;
          }}
        >
          {({
            handleChange,
            handleBlur,
            dirty,
            isValid,
          }): React.ReactElement => (
            <Form>
              <div>
                <label htmlFor="comment" className="block">
                  New Comment
                </label>
                <textarea
                  name="comment"
                  id="post-comment"
                  className="focus:shadow-outline mt-1 h-32 w-full appearance-none rounded bg-gray-300 p-1 text-gray-600 focus:outline-none"
                  placeholder="Add a new comment..."
                  onChange={handleChange}
                  onBlur={handleBlur}
                ></textarea>
                {error && (
                  <div className="text-red-700">
                    There was an error submiting your comment
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="btn m-2 cursor-pointer rounded-lg border border-gray-200 bg-purple-700 p-2 hover:border-gray-300 hover:bg-purple-800 hover:text-gray-300"
                disabled={!isValid || !dirty}
              >
                Post
              </button>
              <button
                onClick={closeFunc}
                className="m-2 rounded-lg border border-gray-200 p-2 hover:border-gray-400 hover:text-gray-400"
                type="button"
              >
                Cancel
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default NewCommentForm;
