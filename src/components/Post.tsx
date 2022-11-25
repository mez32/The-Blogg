import React from "react";
import dayjs from "dayjs";

interface PostProps {
  title: string;
  name: string;
  date: Date;
  content: string;
  id: string;
}

const Post: React.FC<PostProps> = ({
  title,
  name,
  date,
  content,
}: PostProps) => {
  const newDate = dayjs(date).format("MMMM D YYYY h:mma").toString();

  return (
    <div className="mt-2 flex justify-center p-5">
      <div className="min-w-lg block w-11/12 rounded-lg bg-gray p-8 shadow-2xl  xl:max-w-6xl">
        <h2 className="mb-2 text-3xl font-medium leading-tight">{title}</h2>
        <h5 className="text-md font-medium">By {name}</h5>
        <h5 className="text-sm font-medium">on {newDate}</h5>
        <hr className="min-w-lg mx-2 my-2 w-auto" />
        <p className=" mb-4 break-all text-base">{content}</p>
      </div>
    </div>
  );
};

export default Post;
