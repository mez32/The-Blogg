import React, { useEffect, useState } from "react";
import {
  type GetStaticProps,
  type GetStaticPropsResult,
  type InferGetStaticPropsType,
} from "next";
import { type ParsedUrlQuery } from "querystring";
import { prisma } from "../../../server/db/client";
import Head from "next/head";
import Post from "../../../components/Post";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Pagination from "../../../components/Pagination";
import { type Posts } from "../../../types/post";
import ErrorPage from "next/error";

interface StaticPathParams extends ParsedUrlQuery {
  id: string;
}

interface PageProps {
  posts: string;
  id: string;
}

const ShowPosts = ({
  posts,
  id,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [postsList, setPostsList] = useState<Posts[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const indexOfLastRecord = currentPage * 10;
  const indexOfFirstRecord = indexOfLastRecord - 10;

  const currentPosts = postsList.slice(indexOfFirstRecord, indexOfLastRecord);

  // Finds the number of pages needed based on number of posts divided by 10
  const nPages = Math.ceil(postsList.length / 10);

  useEffect(() => {
    const listOfPosts: Posts[] = JSON.parse(posts);
    setPostsList(listOfPosts);
  }, []);

  if (!posts && !id) {
    return <ErrorPage statusCode={404} />;
  }

  if (router.isFallback || status === "loading") {
    return (
      <main>
        <div className="mt-16 flex justify-center p-6">
          <div className="bg-gray block max-w-lg rounded-lg p-8 text-center shadow-2xl md:max-w-3xl">
            <div role="status">
              <svg
                aria-hidden="true"
                className="fill-purple mr-2 h-16 w-16 animate-spin text-middleGray"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
              <h3>Loading...</h3>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>{`The Blogg - ${postsList[0]?.user.name}'s Posts`}</title>
        <meta
          name="description"
          content="The Blogg - A place to have your thoughts seen"
        />
      </Head>
      <main>
        <div className="mt-2 flex justify-center p-6">
          <div className="block max-w-lg rounded-lg bg-gray-900 p-8 text-center shadow-2xl md:max-w-3xl">
            <h2 className="mb-4 text-3xl font-medium leading-tight">
              {`${postsList[0]?.user.name}'s Posts`}
            </h2>
            {session?.user?.id === id && (
              <Link href="/posts/new">
                <button className="m-2 rounded-lg border border-gray-200 bg-purple-700 p-2 hover:border-gray-300 hover:bg-purple-800 hover:text-gray-300">
                  Create a new post
                </button>
              </Link>
            )}
          </div>
        </div>
        <hr className="min-w-lg m-auto w-11/12 xl:max-w-6xl" />
        <>
          {currentPosts.map((post) => {
            return (
              <Post
                key={post.id}
                title={post.title}
                content={post.content}
                date={post.createdAt}
                name={post.user.name!}
                id={post.id}
                likes={post.likes}
                comments={post.comments}
                userId={id}
                numOfLikes={post._count.likes}
                numOfComments={post._count.comments}
              />
            );
          })}
        </>
        <Pagination
          nPages={nPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </main>
    </>
  );
};

export const getStaticPaths = async () => {
  return { paths: [], fallback: true };
};

export const getStaticProps: GetStaticProps<
  PageProps,
  StaticPathParams
> = async ({ params }): Promise<GetStaticPropsResult<any>> => {
  const { id: userId } = params as StaticPathParams;

  const postsList = await prisma.post.findMany({
    where: {
      userId,
    },
    include: {
      user: {
        select: {
          name: true,
          id: true,
        },
      },
      likes: true,
      comments: {
        include: {
          user: {
            select: {
              name: true,
              id: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const posts = JSON.stringify(postsList);

  return {
    props: {
      posts,
      id: userId,
    },
  };
};

export default ShowPosts;
