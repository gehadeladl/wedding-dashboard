import prisma from "@/lib/prisma";

const allowedSections = [
  "SUITS",
  "SHIRTS",
  "BELTS",
  "TIES_BOWTIES",
  "SHOES",
  "TSHIRTS_PULLOVERS",
];

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({
        message: "Method Not Allowed",
      });
    }

    const { section } = req.query;

    if (!section || !allowedSections.includes(section)) {
      return res.status(400).json({
        message: "قسم غير صالح",
      });
    }

    const products = await prisma.product.findMany({
      where: {
        websiteSection: section,
        showOnHome: true,
      },
      include: {
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
      orderBy: [
        {
          displayOrder: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

    return res.status(200).json(products);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message,
    });
  }
}
