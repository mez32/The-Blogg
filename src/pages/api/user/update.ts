import { type NextApiRequest, type NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../server/db/client";

interface BodyAttrs {
  name: string;
  userId: string;
}

export default async function updateUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body: BodyAttrs = req.body;
  const method = req.method;
  const { name, userId } = body;

  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session || session?.user?.id !== userId) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  switch (method) {
    case "PATCH":
      try {
        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            name,
          },
        });
        res.status(200).send({ msg: "Account updated" });
      } catch (error) {
        res.status(500).send({ msg: error });
      }

      break;
    default:
      res.setHeader("Allow", ["PATCH"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
