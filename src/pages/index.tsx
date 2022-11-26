import { InferGetStaticPropsType } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import Post from "../components/Post";
import StartNew from "../components/StartNew";
import { prisma } from "../server/db/client";

interface User {
  id: string;
  name: string | null;
}

interface Like {
  id: string;
  postId: string;
  userId: string;
}

interface Posts {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  userId: string;
  updatedAt?: Date;
  user: User;
  likes: Like[];
  _count: {
    likes: number;
  };
}

const Home = ({ posts }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [listOfPosts, setListOfPosts] = useState<Posts[]>([]);
  console.log(listOfPosts);
  useEffect(() => {
    const postsList: Posts[] = JSON.parse(posts);
    setListOfPosts(postsList);
  }, []);

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
          {listOfPosts.map((post) => {
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
                numOfLikes={post._count.likes}
              />
            );
          })}
        </>
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
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });
  const newPosts = JSON.stringify(posts);
  return {
    props: { posts: newPosts },
  };
};

export default Home;
