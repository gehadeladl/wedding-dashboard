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
      const products = await prisma.product.findMany({
        include: {
          category: true,
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
    }

    if (req.method === "POST") {
      const {
        name,
        categoryId,
        description,
        price,
        websiteSection,
        showOnHome,
        showPrice,
        displayOrder,
        images = [],
      } = req.body;

      const product = await prisma.product.create({
        data: {
          name,
          description,
          price:
            price === undefined || price === null || price === ""
              ? null
              : Number(price),

          websiteSection: websiteSection || null,
          showOnHome: showOnHome ?? true,
          showPrice: showPrice ?? true,
          displayOrder: Number(displayOrder || 0),

          ...(categoryId ? { categoryId } : {}),

          images: {
            create: images.map((image, index) => ({
              imageUrl: image.url,
              sortOrder: index,
            })),
          },
        },

        include: {
          category: true,
          images: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
      });

      return res.status(201).json(product);
    }

    return res.status(405).json({
      message: "Method Not Allowed",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message,
    });
  }
}
