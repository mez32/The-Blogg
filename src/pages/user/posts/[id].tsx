import React, { useEffect, useState } from "react";
import {
  GetStaticProps,
  GetStaticPropsResult,
  InferGetStaticPropsType,
} from "next";
import { ParsedUrlQuery } from "querystring";
import { prisma } from "../../../server/db/client";
import Head from "next/head";
import Post from "../../../components/Post";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface StaticPathParams extends ParsedUrlQuery {
  id: string;
}

interface User {
  name: string | null;
  id: string;
}

interface Posts {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  userId: string;
  updatedAt?: Date;
  user: User;
}

interface PageProps {
  posts: string;
  id: string;
}

const ShowPosts = ({
  posts,
  id,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { data: session } = useSession();
  const [postsList, setPostsList] = useState<Posts[]>([]);

  useEffect(() => {
    const listOfPosts: Posts[] = JSON.parse(posts);
    setPostsList(listOfPosts);
  }, []);

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
          <div className="block max-w-lg rounded-lg bg-gray p-8 text-center shadow-2xl md:max-w-3xl">
            <h2 className="mb-4 text-3xl font-medium leading-tight">
              {`${postsList[0]?.user.name}'s Posts`}
            </h2>
            {session?.user?.id === id && (
              <Link href="/posts/new">
                <button className="login-btn">Create a new post</button>
              </Link>
            )}
          </div>
        </div>
        <hr className="min-w-lg m-auto w-11/12 xl:max-w-6xl" />
        <>
          {postsList.map((post) => {
            return (
              <Post
                key={post.id}
                title={post.title}
                content={post.content}
                date={post.createdAt}
                name={post.user.name!}
                id={post.user.id}
              />
            );
          })}
        </>
      </main>
    </>
  );
};

export const getStaticPaths = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
    },
  });

  const paths = users.map((user) => ({
    params: { id: user.id },
  }));

  return { paths, fallback: true };
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
