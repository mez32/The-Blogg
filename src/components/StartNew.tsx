import React from "react";
import { useSession } from "next-auth/react";

const StartNew = () => {
  const { data: session } = useSession();

  return (
    <div className="mt-2 flex justify-center p-8">
      <div className="block max-w-lg rounded-lg bg-gray p-5 text-center shadow-2xl md:max-w-3xl">
        <h2 className="mb-2 text-2xl font-medium leading-tight">
          Start your new Blogg post...
        </h2>
        {session ? (
          <button className="login-btn">New Post</button>
        ) : (
          <button className="login-btn">Have to login first</button>
        )}
      </div>
    </div>
  );
};

export default StartNew;
