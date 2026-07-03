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
      const customer = await prisma.customer.findUnique({
        where: {
          id,
        },
        include: {
          measurement: true,
        },
      });

      return res.status(200).json(customer);
    }

    if (req.method === "PUT") {
      const customer = await prisma.customer.update({
        where: {
          id,
        },
        data: req.body,
      });

      return res.status(200).json(customer);
    }

    if (req.method === "DELETE") {
      // امسح المقاسات المرتبطة بالعميل الأول
      await prisma.customerMeasurement.deleteMany({
        where: {
          customerId: id,
        },
      });

      // وبعدها امسح العميل نفسه
      await prisma.customer.delete({
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
