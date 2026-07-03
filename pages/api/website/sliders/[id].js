import prisma from "@/lib/prisma";
import { getAuth } from "@/lib/auth";

export default async function handler(req, res) {
  const user = getAuth(req);

  if (!user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const { id } = req.query;

  try {
    if (req.method === "DELETE") {
      await prisma.homeSlider.delete({
        where: {
          id,
        },
      });

      return res.status(200).json({
        success: true,
      });
    }

    if (req.method === "PUT") {
      const { sortOrder, isActive } = req.body;

      const slider = await prisma.homeSlider.update({
        where: {
          id,
        },
        data: {
          ...(sortOrder !== undefined ? { sortOrder } : {}),
          ...(isActive !== undefined ? { isActive } : {}),
        },
      });

      return res.status(200).json(slider);
    }

    return res.status(405).json({
      message: "Method Not Allowed",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
