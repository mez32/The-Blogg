import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

const Header = () => {
  // TODO: Add logic to go to users posts
  const { data: session } = useSession();

  return (
    <header className="z-1 fixed left-0 top-0 w-full bg-purple py-4">
      <div className="my-link inline-block h-full px-7 align-middle text-3xl font-extrabold">
        <Link href="/">The Blogg</Link>
      </div>

      <nav className="inline-block w-[calc(100%-12.5rem)] text-right align-middle">
        <ul className="m-0 list-none p-0">
          {session && (
            <>
              <li className="mx-4 my-0 inline-block">
                <div className="my-link text-xl">
                  <Link href="">My Posts</Link>
                </div>
              </li>
              <li className="mx-4 my-0 inline-block">
                <div className="my-link text-xl">
                  <Link href="">{session?.user?.name}'s Account</Link>
                </div>
              </li>
            </>
          )}

          <li className="mx-4 my-0 inline-block">
            {!session ? (
              <div className="login-btn text-xl">
                <button onClick={() => signIn()}>Login / Sign Up</button>
              </div>
            ) : (
              <div className="login-btn my-link text-xl">
                <button onClick={() => signOut()}>Logout</button>
              </div>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
