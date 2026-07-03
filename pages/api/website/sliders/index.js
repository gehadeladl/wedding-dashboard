import prisma from "@/lib/prisma";
import { getAuth } from "@/lib/auth";

export default async function handler(req, res) {
  const user = getAuth(req);

  if (!user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    if (req.method === "GET") {
      const sliders = await prisma.homeSlider.findMany({
        orderBy: {
          sortOrder: "asc",
        },
      });

      return res.status(200).json(sliders);
    }

    if (req.method === "POST") {
      const { imageUrl } = req.body;

      if (!imageUrl) {
        return res.status(400).json({
          message: "الصورة مطلوبة",
        });
      }

      const count = await prisma.homeSlider.count();

      if (count >= 6) {
        return res.status(400).json({
          message: "لا يمكن إضافة أكثر من 6 صور في السلايدر",
        });
      }

      const lastSlider = await prisma.homeSlider.findFirst({
        orderBy: {
          sortOrder: "desc",
        },
      });

      const slider = await prisma.homeSlider.create({
        data: {
          imageUrl,
          sortOrder: lastSlider ? lastSlider.sortOrder + 1 : 1,
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
