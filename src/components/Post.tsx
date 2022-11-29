import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import Link from "next/link";
import { useSession } from "next-auth/react";
import axios from "axios";
import Comment from "./Comment";
import NewCommentForm from "./NewCommentForm";

interface User {
  id: string;
  name: string | null;
}

interface Like {
  id: string;
  postId: string;
  userId: string;
}

interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: Date;
  user: User;
}

interface PostProps {
  id: string;
  title: string;
  name: string;
  date: Date;
  content: string;
  userId: string;
  likes: Like[];
  comments: Comment[];
  numOfLikes: number;
  numOfComments: number;
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
  numOfComments,
  comments,
}: PostProps) => {
  const { data: session, status } = useSession();
  const [likesCount, setLikesCount] = useState<number>(0);
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [commentsCount, setCommentsCount] = useState<number>(0);
  const [alreadyLiked, setAlreadyLiked] = useState<boolean>(false);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [showNewComment, setShowNewComment] = useState<boolean>(false);

  const newDate = dayjs(date).format("MMMM D YYYY h:mma").toString();

  // TODO: Add logic to refresh a single post after a new comment is added by making an API end point to get the updated post, need to set comments in the intial useEffect so that state can be overridden with new data from the endpoint

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
      setLikesCount((likesCount) => likesCount + 1);
      setAlreadyLiked(true);
      return;
    }
  };

  const handleUnlike = async (): Promise<void> => {
    if (!session) {
      return;
    }

    const body = {
      postId: id,
      userId: userId,
    };

    const res = await axios.post("/api/posts/unlike", body);
    if (res.status === 200) {
      setLikesCount((likesCount) => likesCount - 1);
      setAlreadyLiked(false);
      return;
    }
  };

  const alreadyLikedFunc = (): void => {
    for (let like of likes) {
      if (like.userId === session?.user!.id) {
        return setAlreadyLiked(true);
      }
    }
  };

  const showCommentsHandler = (value?: boolean): void => {
    if (value) {
      return setShowComments(value);
    }
    return setShowComments(!showComments);
  };

  const newCommentHandler = (): void => {
    setShowNewComment(!showNewComment);
  };

  useEffect(() => {
    alreadyLikedFunc();
    setCommentList(comments);
    setLikesCount(numOfLikes);
    setCommentsCount(numOfComments);
  }, [status]);

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
        <h5 className="text-sm font-medium">{newDate}</h5>
        <hr className="min-w-lg mx-2 my-2 w-auto" />
        <p className="mb-4 break-all text-base">{content}</p>

        <div className="block">
          {session && alreadyLiked === false ? (
            <button onClick={handleLike} className="like-btn mb-2 mr-2">
              Like
            </button>
          ) : (
            <div
              onClick={handleUnlike}
              className="mr-2 ml-1 mb-2 inline-block hover:cursor-pointer hover:underline"
            >
              Liked!
            </div>
          )}
          <p className="inline">
            {likesCount} {likesCount === 1 ? "like" : "likes"}
          </p>
        </div>
        <div className="block align-middle">
          {session && (
            <button onClick={newCommentHandler} className="like-btn mr-2">
              Comment
            </button>
          )}
          <h5
            onClick={() => showCommentsHandler()}
            className="mt-2 inline-block cursor-pointer text-sm font-medium hover:underline"
          >
            {commentsCount} {commentsCount === 1 ? "comment" : "comments"}
          </h5>
          {!showComments ? (
            <p
              onClick={() => showCommentsHandler()}
              className="toggle-btn__open inline"
            >
              +
            </p>
          ) : (
            <p
              onClick={() => showCommentsHandler()}
              className="toggle-btn__close inline"
            >
              -
            </p>
          )}
        </div>
        {showNewComment && (
          <div>
            <NewCommentForm
              id={id}
              setComments={setCommentList}
              userId={session?.user?.id}
              closeFunc={newCommentHandler}
              openFunc={showCommentsHandler}
              setCommentsCount={setCommentsCount}
            />
          </div>
        )}
        {showComments && commentsCount === 0 && (
          <div className="m-2 flex pt-2">No comments yet!</div>
        )}
        {showComments && commentsCount > 0 && (
          <div>
            {commentList.map((comment) => {
              return (
                <Comment
                  key={comment.id}
                  name={comment.user.name}
                  content={comment.content}
                  userId={comment.userId}
                  createdAt={comment.createdAt}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
