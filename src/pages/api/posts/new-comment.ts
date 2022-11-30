import { type NextApiRequest, type NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { prisma } from "../../../server/db/client";
import { authOptions } from "../auth/[...nextauth]";

interface PostAttrs {
  postId: string;
  content: string;
  userId: string;
}

export default async function newPost(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body: PostAttrs = req.body;
  const method = req.method;
  const { postId, content, userId } = body;

  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  if (!postId || !content || !userId) {
    return res.status(400).send({ msg: "Invalid request, missing a field" });
  }

  switch (method) {
    case "POST":
      try {
        const createComment = await prisma.comment.create({
          data: {
            content,
            user: {
              connect: { id: userId },
            },
            post: {
              connect: { id: postId },
            },
          },
        });
        res.status(201).send(createComment);
      } catch (error) {
        res.status(500).send({ msg: error });
      }
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
