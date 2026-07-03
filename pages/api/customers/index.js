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
      const customers = await prisma.customer.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.status(200).json(customers);
    }

    if (req.method === "POST") {
      const customer = await prisma.customer.create({
        data: {
          name: req.body.name,
          phone: req.body.phone,

          deliveryDate: new Date(req.body.deliveryDate),

          totalAmount: req.body.totalAmount
            ? Number(req.body.totalAmount)
            : null,

          paidAmount: req.body.paidAmount ? Number(req.body.paidAmount) : null,

          remainingAmount: req.body.remainingAmount
            ? Number(req.body.remainingAmount)
            : null,

          notes: req.body.notes || null,
        },
      });

      return res.status(201).json(customer);
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
