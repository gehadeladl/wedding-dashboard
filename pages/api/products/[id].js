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
    if (req.method === "GET") {
      const product = await prisma.product.findUnique({
        where: {
          id,
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

      return res.status(200).json(product);
    }

    if (req.method === "PUT") {
      const {
        name,
        categoryId,
        description,
        price,
        websiteSection,
        showOnHome,
        showPrice,
        displayOrder,
        image,
      } = req.body;

      await prisma.product.update({
        where: {
          id,
        },

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
        },
      });

      if (image?.url) {
        await prisma.productImage.deleteMany({
          where: {
            productId: id,
          },
        });

        await prisma.productImage.create({
          data: {
            productId: id,
            imageUrl: image.url,
            sortOrder: 0,
          },
        });
      }

      const updatedProduct = await prisma.product.findUnique({
        where: {
          id,
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

      return res.status(200).json(updatedProduct);
    }

    if (req.method === "DELETE") {
      await prisma.productImage.deleteMany({
        where: {
          productId: id,
        },
      });

      await prisma.product.delete({
        where: {
          id,
        },
      });

      return res.status(200).json({
        success: true,
      });
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
