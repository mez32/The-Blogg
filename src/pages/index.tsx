import { type InferGetStaticPropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import Post from "../components/Post";
import StartNew from "../components/StartNew";
import { prisma } from "../server/db/client";
import { type Posts } from "../types/post";
import ErrorPage from "next/error";

const Home = ({ posts }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  const [listOfPosts, setListOfPosts] = useState<Posts[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Finds the indexes of the current 10 pages based on the page number
  const indexOfLastRecord = currentPage * 10;
  const indexOfFirstRecord = indexOfLastRecord - 10;

  // Sets the current posts to show based on indexes from above
  const currentPosts = listOfPosts.slice(indexOfFirstRecord, indexOfLastRecord);

  // Finds the number of pages needed based on number of posts divided by 10
  const nPages = Math.ceil(listOfPosts.length / 10);

  useEffect(() => {
    const postsList: Posts[] = JSON.parse(posts);
    setListOfPosts(postsList);
  }, [posts]);

  if (!router.isFallback && !posts) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
      <Head>
        <title>The Blogg</title>
        <meta
          name="description"
          content="The Blogg - A place to have your thoughts seen"
        />
      </Head>
      <main>
        <StartNew />
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
                userId={post.user.id}
                id={post.id}
                likes={post.likes}
                comments={post.comments}
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

export const getStaticProps = async () => {
  const posts = await prisma.post.findMany({
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
  const newPosts = JSON.stringify(posts);
  return {
    props: { posts: newPosts },
  };
};

export default Home;
