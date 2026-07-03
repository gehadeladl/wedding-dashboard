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
    if (req.method === "POST") {
      const measurement = await prisma.customerMeasurement.upsert({
        where: {
          customerId: id,
        },

        update: {
          ...req.body,
        },

        create: {
          customerId: id,
          ...req.body,
        },
      });

      await prisma.customer.update({
        where: {
          id,
        },

        data: {
          measurementsCompleted: true,
          orderStatus: "MEASURED",
        },
      });

      return res.status(200).json(measurement);
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
