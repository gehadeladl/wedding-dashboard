import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({
        message: "Method Not Allowed",
      });
    }

    const sliders = await prisma.homeSlider.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
    });

    const products = await prisma.product.findMany({
      where: {
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

    const sections = {
      suits: products
        .filter((item) => item.websiteSection === "SUITS")
        .slice(0, 6),
      shirts: products
        .filter((item) => item.websiteSection === "SHIRTS")
        .slice(0, 6),
      belts: products
        .filter((item) => item.websiteSection === "BELTS")
        .slice(0, 6),
      tiesBowties: products
        .filter((item) => item.websiteSection === "TIES_BOWTIES")
        .slice(0, 6),
      shoes: products
        .filter((item) => item.websiteSection === "SHOES")
        .slice(0, 6),
      casual: products
        .filter((item) => item.websiteSection === "TSHIRTS_PULLOVERS")
        .slice(0, 6),
    };

    return res.status(200).json({
      sliders,
      sections,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message,
    });
  }
}
