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
    if (req.method === "PUT") {
      const { action, quantity } = req.body;

      if (!action || !quantity) {
        return res.status(400).json({
          message: "action و quantity مطلوبان",
        });
      }

      const item = await prisma.inventoryItem.findUnique({
        where: {
          id,
        },
      });

      if (!item) {
        return res.status(404).json({
          message: "العنصر غير موجود",
        });
      }

      const qty = Number(quantity);

      if (qty <= 0) {
        return res.status(400).json({
          message: "الكمية يجب أن تكون أكبر من صفر",
        });
      }

      let newQuantity = item.quantity;

      if (action === "ADD") {
        newQuantity = item.quantity + qty;
      } else if (action === "SUBTRACT") {
        if (qty > item.quantity) {
          return res.status(400).json({
            message: "الكمية المطلوبة أكبر من المتاح",
          });
        }

        newQuantity = item.quantity - qty;
      } else {
        return res.status(400).json({
          message: "action غير صحيح",
        });
      }

      const updatedItem = await prisma.inventoryItem.update({
        where: {
          id,
        },
        data: {
          quantity: newQuantity,
        },
      });

      return res.status(200).json(updatedItem);
    }

    if (req.method === "DELETE") {
      await prisma.inventoryItem.delete({
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
    return res.status(500).json({
      message: error.message,
    });
  }
}
