import dayjs from "dayjs";
import Link from "next/link";
import React from "react";

interface CommentProps {
  name: string | null;
  content: string;
  userId: string;
  createdAt: Date;
}

const PostComment = ({ name, content, userId, createdAt }: CommentProps) => {
  const date = dayjs(createdAt).format("MMMM D YYYY h:mma").toString();

  return (
    <div className="m-2 flex">
      <div className="block w-full rounded-lg border p-3 shadow-xl">
        <h5 className="text-base font-medium">
          <Link
            className="hover:underline"
            href={{ pathname: "/user/posts/[id]", query: { userId } }}
          >
            {name}
          </Link>{" "}
          - {date}
        </h5>
        <hr className="mx-2 my-2 w-auto" />
        <p className="mb-2 break-all text-base">{content}</p>
      </div>
    </div>
  );
};

export default PostComment;
