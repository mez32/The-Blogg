import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { prisma } from "../../../server/db/client";
import { authOptions } from "../auth/[...nextauth]";

interface PostAttrs {
  postId: string;
  userId: string;
}

export default async function deletePost(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body: PostAttrs = req.body;
  const method = req.method;
  const { postId, userId } = body;

  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  if (!postId) {
    return res.status(400).send({ msg: "Invalid request, missing a field" });
  }

  if (userId !== session.user?.id) {
    return res
      .status(401)
      .send({ msg: "Not authorized to perform that action" });
  }

  switch (method) {
    case "POST":
      try {
        await prisma.post.delete({
          where: {
            id: postId,
          },
        });
        res.status(200).send({ msg: "Post deleted." });
      } catch (error) {
        res.status(500).send({ msg: error });
      }
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
