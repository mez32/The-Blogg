import React, { useState } from "react";
import axios from "axios";
import { Form, Formik } from "formik";

interface Errors {
  comment?: string;
}

interface User {
  id: string;
  name: string | null;
}

interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: Date;
  user: User;
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
        console.log(comments.data.length);
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
                  className="focus:shadow-outline mt-1 h-32 w-full appearance-none rounded focus:outline-none"
                  placeholder="Add a new comment..."
                  onChange={handleChange}
                  onBlur={handleBlur}
                ></textarea>
                {error && (
                  <div className="error-text">
                    There was an error submiting your post
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="login-btn m-2"
                disabled={!isValid || !dirty}
              >
                Post
              </button>
              <button onClick={closeFunc} className="m-2 rounded-lg border p-2">
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
