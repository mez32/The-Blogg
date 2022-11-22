import { type NextPage } from "next";
import { useSession, signIn, signOut } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Post from "../components/Post";
import StartNew from "../components/StartNew";

const Home: NextPage = () => {
  const { data: session } = useSession();

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
        <hr className="m-auto w-2/3" />
        <Post />
        <Post />
      </main>
    </>
  );
};

export default Home;
