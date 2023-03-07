import React, { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

const Header = () => {
  const { data: session } = useSession();

  const [show, setShow] = useState<boolean>(false);

  return (
    <>
      <header className="z-1 h-18 fixed left-0 top-0 w-full bg-purple-700 py-4">
        <div className="inline-block h-full px-7 align-middle text-3xl font-extrabold hover:text-gray-300">
          <Link href="/">The Blogg</Link>
        </div>

        <nav className="main-nav inline-block w-[calc(100%-13rem)] text-right align-middle">
          <ul className="m-0 list-none p-0">
            <li className="mx-4 my-0 inline-block">
              <div className="text-xl hover:text-gray-300 active:scale-90">
                <Link href={"/about"}>About</Link>
              </div>
            </li>
            {session && (
              <>
                <li className="mx-4 my-0 inline-block">
                  <div className="text-xl hover:text-gray-300 active:scale-90">
                    <Link href={`/user/posts/${session.user?.id}`}>
                      My Posts
                    </Link>
                  </div>
                </li>
                <li className="mx-4 my-0 inline-block">
                  <div className="text-xl hover:text-gray-300 active:scale-90">
                    <Link
                      href={{
                        pathname: "/user/[id]",
                        query: { id: session?.user?.id },
                      }}
                    >
                      My Account
                    </Link>
                  </div>
                </li>
              </>
            )}

            <li className="mx-4 my-0 inline-block">
              {!session ? (
                <div className="text-xl">
                  <button
                    className="rounded-lg border border-gray-200 p-2 hover:border-gray-300 hover:bg-purple-800 hover:text-gray-300 active:scale-90"
                    onClick={() => signIn()}
                  >
                    Login / Sign Up
                  </button>
                </div>
              ) : (
                <div className="text-xl">
                  <button
                    className="rounded-lg border border-gray-200 p-2 hover:border-gray-300 hover:bg-purple-800 hover:text-gray-300 active:scale-90"
                    onClick={() => signOut()}
                  >
                    Logout
                  </button>
                </div>
              )}
            </li>
          </ul>
        </nav>

        <div className="mobile-wrapper relative inline-block w-[calc(100%-13.5rem)] text-right align-middle">
          {show && (
            <div onClick={() => setShow(!show)} className="backdrop"></div>
          )}
          <button
            className="w-14 rounded-lg border border-gray-200 p-2 hover:border-gray-400 hover:bg-purple-800 hover:text-gray-400 active:border-gray-400 active:bg-purple-800 active:text-gray-300"
            onClick={() => setShow(!show)}
          >
            Menu
          </button>
          {show && (
            <div className="absolute right-0 top-0 z-10 block rounded-md bg-gray-900 text-center shadow-lg">
              <Link
                onClick={() => setShow(!show)}
                className="block px-6 pt-4 text-2xl hover:text-gray-400 active:text-gray-400"
                href={"/about"}
              >
                About
              </Link>
              {session && (
                <>
                  <Link
                    className="block px-4 pt-4 text-2xl hover:text-gray-400 active:text-gray-400"
                    href={`/user/posts/${session.user?.id}`}
                    onClick={() => setShow(!show)}
                  >
                    My Posts
                  </Link>
                  <Link
                    className="block truncate px-16 pt-4 text-2xl hover:text-gray-400 active:text-gray-400"
                    href={{
                      pathname: "/user/[id]",
                      query: { id: session?.user?.id },
                    }}
                    onClick={() => setShow(!show)}
                  >
                    My Account
                  </Link>
                </>
              )}
              {!session ? (
                <Link
                  className="block px-4 pt-4 text-2xl hover:text-gray-400 active:text-gray-400"
                  href="#"
                  onClick={() => signIn()}
                >
                  Login / Sign Up
                </Link>
              ) : (
                <Link
                  className="block px-4 pt-4 text-2xl hover:text-gray-400 active:text-gray-400"
                  href="#"
                  onClick={() => signOut()}
                >
                  Logout
                </Link>
              )}
              <Link
                className="block py-4 px-4 text-2xl hover:text-gray-400 active:text-gray-400"
                href="#"
                onClick={() => setShow(!show)}
              >
                Close
              </Link>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
