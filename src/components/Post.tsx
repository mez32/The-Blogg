import React from "react";
import dayjs from "dayjs";

interface PostProps {
  title: string;
  name: string;
  date: Date;
  content: string;
}

const Post = ({ title, name, date, content }: PostProps) => {
  const newDate = dayjs(date).format("MMMM D YYYY h:mma");

  console.log(newDate);

  return (
    <div className="mt-2 flex justify-center p-5">
      <div className="min-w-lg block w-8/12 rounded-lg bg-gray p-5 shadow-2xl md:max-w-3xl">
        <h2 className="mb-2 text-2xl font-medium leading-tight">{title}</h2>
        <h5 className="text-md font-medium">By {name}</h5>
        <h5 className="text-sm font-medium">on {newDate.toString()}</h5>
        <br />
        <p className=" mb-4 break-all text-base">{content}</p>
      </div>
    </div>
  );
};

export default Post;
