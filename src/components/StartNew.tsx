import React from "react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

const StartNew: React.FC = () => {
  const { data: session } = useSession();

  return (
    <div className="mt-2 flex justify-center p-6">
      <div className="block max-w-lg rounded-lg bg-gray-900 p-8 text-center shadow-2xl">
        <h2 className="mb-4 text-3xl font-medium leading-tight">
          Start your new Blogg post...
        </h2>
        {session ? (
          <Link href="/posts/new">
            <button className="m-2 rounded-lg border border-gray-200 bg-purple-700 p-2 hover:border-gray-300 hover:bg-purple-800 hover:text-gray-300">
              New Post
            </button>
          </Link>
        ) : (
          <button
            className="m-2 rounded-lg border border-gray-200 bg-purple-700 p-2 hover:border-gray-300 hover:bg-purple-800 hover:text-gray-300"
            onClick={() => signIn()}
          >
            Have to login first
          </button>
        )}
      </div>
    </div>
  );
};

export default StartNew;
