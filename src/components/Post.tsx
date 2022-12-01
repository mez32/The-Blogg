import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import Link from "next/link";
import { useSession } from "next-auth/react";
import axios from "axios";
import PostComment from "./PostComment";
import NewCommentForm from "./NewCommentForm";
import { type Like, type Comment } from "../types/post";
import { useRouter } from "next/router";

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
  const router = useRouter();

  const [likesCount, setLikesCount] = useState<number>(0);
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [commentsCount, setCommentsCount] = useState<number>(0);
  const [alreadyLiked, setAlreadyLiked] = useState<boolean>(false);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [showNewComment, setShowNewComment] = useState<boolean>(false);
  const [areYouSure, setAreYouSure] = useState<boolean>(false);

  const newDate = dayjs(date).format("MMMM D YYYY h:mma").toString();

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
    for (const like of likes) {
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

  const deletePostHandler = async (): Promise<void> => {
    if (!session) {
      return;
    }

    const body = {
      postId: id,
      userId,
    };
    try {
      const res = await axios.post("/api/posts/delete", body);
      if (res.status === 200) {
        router.reload();
      }
    } catch (error) {}
  };

  useEffect(() => {
    alreadyLikedFunc();
    setCommentList(comments);
    setLikesCount(numOfLikes);
    setCommentsCount(numOfComments);
  }, [status]);

  return (
    <div className="mt-2 flex justify-center p-5">
      <div className="min-w-lg block w-11/12 rounded-lg bg-gray-900 p-8 shadow-2xl xl:max-w-6xl">
        <h2 className="mb-2 text-3xl font-medium leading-tight">{title}</h2>
        <h5 className="text-md font-medium">
          By{" "}
          <Link
            className="hover:text-gray-300 hover:underline"
            href={{ pathname: "/user/posts/[id]", query: { id: userId } }}
          >
            {name}
          </Link>
        </h5>
        <h5 className="text-sm font-medium">{newDate}</h5>
        <hr className="min-w-lg mx-2 my-2 w-auto" />
        <p className="mb-4 break-all text-base">{content}</p>
        {session?.user?.id === userId &&
          (!areYouSure ? (
            <div className="block">
              <button
                onClick={() => setAreYouSure(true)}
                className="mb-2 hover:text-red-700 hover:underline"
              >
                Delete Post
              </button>
            </div>
          ) : (
            <div className="block">
              <div className="mr-1 inline">Are you sure? </div>
              <button
                className="mr-2 mb-2 hover:text-red-700 hover:underline"
                onClick={deletePostHandler}
              >
                Yes
              </button>
              <button
                className="mb-2 hover:text-gray-300 hover:underline"
                onClick={() => setAreYouSure(false)}
              >
                No
              </button>
            </div>
          ))}

        <div className="block">
          {session &&
            (alreadyLiked === false ? (
              <button
                onClick={handleLike}
                className="mb-2 mr-2 rounded-lg border border-gray-200 bg-purple-700 p-2 hover:border-gray-300 hover:bg-purple-800 hover:text-gray-300"
              >
                Like
              </button>
            ) : (
              <div
                onClick={handleUnlike}
                className="mr-2 ml-1 mb-2 inline-block hover:cursor-pointer hover:underline"
              >
                Liked!
              </div>
            ))}
          <p className="inline">
            {likesCount} {likesCount === 1 ? "like" : "likes"}
          </p>
        </div>
        <div className="block align-middle">
          {session && (
            <button
              onClick={newCommentHandler}
              className="mr-2 rounded-lg border border-gray-200 bg-purple-700 p-2 hover:border-gray-300 hover:bg-purple-800 hover:text-gray-300"
            >
              Comment
            </button>
          )}
          <h5
            onClick={() => showCommentsHandler()}
            className="mt-2 inline-block cursor-pointer text-sm font-medium hover:text-gray-300 hover:underline"
          >
            {commentsCount} {commentsCount === 1 ? "comment" : "comments"}
          </h5>
          {!showComments ? (
            <p
              onClick={() => showCommentsHandler()}
              className="toggle-btn__open inline border border-gray-200 text-gray-200"
            >
              +
            </p>
          ) : (
            <p
              onClick={() => showCommentsHandler()}
              className="toggle-btn__close inline border border-gray-200 text-gray-200"
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
                <PostComment
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
