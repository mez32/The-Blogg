import { useRouter } from "next/router";
import React from "react";

const AboutPage = () => {
  const router = useRouter();

  return (
    <main>
      <div className="align-center mt-2 flex justify-center p-6">
        <div className="max-w-2lg block w-full rounded-lg bg-gray p-8 shadow-2xl md:max-w-3xl">
          <h2 className="pb-2 text-center text-4xl">About This Site</h2>
          <hr className="min-w-lg m-auto w-11/12 pb-2 xl:max-w-6xl" />
          <p className="text-lg">
            Hello all! Thanks for visiting my site! So a quick run down on this
            site and what I used to make it. It was made with TypeScript,
            NextJS, Tailwind, Prisma, and MySQL using the Create T3 App as a
            template to start. The entire project runs on Docker with a MySQL
            database during development and is all brought up with a single
            command. Authentication is done through NextAuthJS through the
            Create T3 App template and I have Google and Github set up on it to
            keep things simple for the time being. I didn't use any UI libraries
            in this project so everything you see is straight HTML and Tailwind
            all written by me. The entire site's layout and functionality all
            came from my own mind with no guidance or tutorials being followed
            as a way to test my knowledge and ability to build a website from
            scratch and to have a fun project to show off. The site is being
            hosted on Vercel with a database running on PlanetScale. You can
            view the repo for this site on GitHub right{" "}
            <a
              className="hover:underline"
              href="https://github.com/mez32/The-Blogg"
              target="_blank"
            >
              HERE.
            </a>{" "}
            Also from my GitHub you can view my socials like my personal site
            and my LinkedIn if you would like to contact me. Again, thanks for
            visiting and checking out my work!
          </p>
          <div className="mt-4 text-center">
            <button onClick={() => router.push("/")} className="login-btn">
              Back Home
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AboutPage;
