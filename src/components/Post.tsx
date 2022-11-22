import React from "react";

const Post = () => {
  return (
    <div className="mt-2 flex justify-center p-5">
      <div className="block max-w-lg rounded-lg bg-gray p-5 shadow-2xl md:max-w-3xl">
        <h2 className="mb-2 text-2xl font-medium leading-tight">Card title</h2>
        <h5 className="text-md font-medium">By display name</h5>
        <h5 className="text-sm font-medium">at 12:00pm</h5>
        <br />
        <p className=" mb-4 text-base">
          Some quick example text to build on the card title and make up the
          bulk of the card's content. Some quick example text to build on the
          card title and make up the bulk of the card's content. Some quick
          example text to build on the card title and make up the bulk of the
          card's content.
        </p>
      </div>
    </div>
  );
};

export default Post;
