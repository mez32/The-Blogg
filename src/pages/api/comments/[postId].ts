import { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../server/db/client";

interface Query {
  postId: string;
}

export default async function getPostsComments(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query, method } = req;
  const { postId } = query as Partial<Query>;

  if (!postId) {
    return res.status(404).send({ msg: "PostId not provided" });
  }

  switch (method) {
    case "GET":
      try {
        const comments = await prisma.comment.findMany({
          where: {
            postId,
          },
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
        });

        res.status(200).send(comments);
      } catch (error) {
        res.status(500).send({ msg: error });
      }
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
