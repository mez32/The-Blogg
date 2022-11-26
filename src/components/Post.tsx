import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import Link from "next/link";
import { useSession } from "next-auth/react";
import axios from "axios";

interface Like {
  id: string;
  postId: string;
  userId: string;
}

interface PostProps {
  id: string;
  title: string;
  name: string;
  date: Date;
  content: string;
  userId: string;
  likes: Like[];
  numOfLikes: number;
}

const Post: React.FC<PostProps> = ({
  id,
  title,
  name,
  date,
  content,
  userId,
  likes,
  numOfLikes,
}: PostProps) => {
  const { data: session } = useSession();
  const newDate = dayjs(date).format("MMMM D YYYY h:mma").toString();
  const [likesCount, setLikesCount] = useState<number>(0);
  const [alreadyLiked, setAlreadyLiked] = useState<boolean>(false);

  const handleLike = async (): Promise<void> => {
    if (!session) {
      return;
    }

    const body = {
      postId: id,
      userId: userId,
    };

    const res = await axios.post("/api/posts/like", body);
    if (res.status === 201) {
      return;
    }
  };

  const alreadyLikedFunc = (): void => {
    for (let like of likes) {
      if (like.userId === session?.user?.id) {
        return setAlreadyLiked(true);
      }
    }
  };

  useEffect(() => {
    alreadyLikedFunc();
    setLikesCount(numOfLikes);
  }, []);

  return (
    <div className="mt-2 flex justify-center p-5">
      <div className="min-w-lg block w-11/12 rounded-lg bg-gray p-8 shadow-2xl  xl:max-w-6xl">
        <h2 className="mb-2 text-3xl font-medium leading-tight">{title}</h2>

        <h5 className="text-md font-medium">
          By{" "}
          <Link
            className="hover:underline"
            href={{ pathname: "/user/posts/[id]", query: { userId } }}
          >
            {name}
          </Link>
        </h5>
        <h5 className="text-sm font-medium">on {newDate}</h5>
        <hr className="min-w-lg mx-2 my-2 w-auto" />
        <p className="mb-4 break-all text-base">{content}</p>
        <button className="like-btn mr-2">Comment</button>
        {alreadyLiked === false ? (
          <button onClick={handleLike} className="like-btn mr-2">
            Like
          </button>
        ) : (
          <div className="mr-2 inline"> Liked!</div>
        )}
        <p className="inline">
          {likesCount} {likesCount === 1 ? "like" : "likes"}
        </p>
        <h5 className="mt-2 text-sm font-medium hover:underline">
          Show comments
        </h5>
      </div>
    </div>
  );
};

export default Post;
