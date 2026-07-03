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
      const items = await prisma.inventoryItem.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.status(200).json(items);
    }

    if (req.method === "POST") {
      const { itemType, color, size, style, material, shirtFit, quantity } =
        req.body;

      if (!itemType || !quantity) {
        return res.status(400).json({
          message: "النوع والكمية مطلوبان",
        });
      }

      const existingItem = await prisma.inventoryItem.findFirst({
        where: {
          itemType,
          color: color || null,
          size: size || null,
          style: style || null,
          material: material || null,
          shirtFit: shirtFit || null,
        },
      });

      if (existingItem) {
        const updatedItem = await prisma.inventoryItem.update({
          where: {
            id: existingItem.id,
          },
          data: {
            quantity: existingItem.quantity + Number(quantity),
          },
        });

        return res.status(200).json(updatedItem);
      }

      const item = await prisma.inventoryItem.create({
        data: {
          itemType,
          color: color || null,
          size: size || null,
          style: style || null,
          material: material || null,
          shirtFit: shirtFit || null,
          quantity: Number(quantity),
        },
      });

      return res.status(200).json(item);
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
