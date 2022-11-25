import React from "react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

const StartNew: React.FC = () => {
  const { data: session } = useSession();

  return (
    <div className="mt-2 flex justify-center p-6">
      <div className="block max-w-lg rounded-lg bg-gray p-8 text-center shadow-2xl">
        <h2 className="mb-4 text-3xl font-medium leading-tight">
          Start your new Blogg post...
        </h2>
        {session ? (
          <Link href="/posts/new">
            <button className="login-btn">New Post</button>
          </Link>
        ) : (
          <button className="login-btn" onClick={() => signIn()}>
            Have to login first
          </button>
        )}
      </div>
    </div>
  );
};

export default StartNew;
