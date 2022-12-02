import { type NextApiRequest, type NextApiResponse } from "next";

import { prisma } from "../../../server/db/client";

interface Query {
  id: string;
}

export default async function getUserName(
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
        const name = await prisma.user.findUnique({
          where: {
            id,
          },
          select: {
            name: true,
          },
        });

        if (!name) {
          return res.status(400).send({ msg: "User does not exist" });
        }

        res.status(200).send(name);

        break;
      } catch (error) {
        res.status(500).send({ msg: error });
      }
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
