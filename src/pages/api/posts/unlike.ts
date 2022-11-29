import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../server/db/client";

interface Body {
  userId: string;
  postId: string;
}

export default async function removeLike(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body: Body = req.body;
  const method = req.method;
  const { userId, postId } = body;

  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  switch (method) {
    case "POST":
      try {
        await prisma.like.deleteMany({
          where: {
            postId,
            userId,
          },
        });
        res.status(200).send({ msg: "Like Deleted" });
      } catch (error) {
        res.status(500).send({ msg: error });
      }

      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
