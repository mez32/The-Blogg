import { type NextApiRequest, type NextApiResponse } from "next";

import { prisma } from "../../../../server/db/client";

interface Query {
  id: string;
}

export default async function getPosts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query, method } = req;
  const { id } = query as Partial<Query>;

  if (!id) {
    return res.status(404).send({ msg: "UserId not provided" });
  }

  switch (method) {
    case "GET":
      try {
        const postsList = await prisma.post.findMany({
          where: {
            userId: id,
          },
          include: {
            user: {
              select: {
                name: true,
                id: true,
              },
            },
            likes: true,
            comments: {
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
            },
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        res.status(200).send(postsList);

        break;
      } catch (error) {
        res.status(500).send({ msg: error });
      }
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
