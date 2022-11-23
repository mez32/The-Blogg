import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db/client";

interface PostAttrs {
  title: string;
  content: string;
  userId: string;
}

export default async function newPost(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body: PostAttrs = req.body;
  const method = req.method;
  const { title, content, userId } = body;

  if (!title || !content || !userId) {
    return res.status(400).send({ msg: "Invalid request, missing a field" });
  }

  switch (method) {
    case "POST":
      try {
        const createPost = await prisma.post.create({
          data: {
            title,
            content,
            user: {
              connect: { id: userId },
            },
          },
        });
        res.status(201).send(createPost);
      } catch (error) {
        res.status(500).send({ msg: error });
      }
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
