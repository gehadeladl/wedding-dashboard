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
    // =========================
    // إحصائيات العملاء
    // =========================
    const totalCustomers = await prisma.customer.count();

    const newCustomers = await prisma.customer.count({
      where: {
        orderStatus: "NEW",
      },
    });

    const measuredCustomers = await prisma.customer.count({
      where: {
        measurementsCompleted: true,
      },
    });

    const inProgressCustomers = await prisma.customer.count({
      where: {
        orderStatus: "IN_PROGRESS",
      },
    });

    const readyCustomers = await prisma.customer.count({
      where: {
        orderStatus: "READY",
      },
    });

    const deliveredCustomers = await prisma.customer.count({
      where: {
        isDelivered: true,
      },
    });

    // =========================
    // المبالغ
    // =========================
    const customers = await prisma.customer.findMany({
      select: {
        totalAmount: true,
        remainingAmount: true,
      },
    });

    const totalSales = customers.reduce(
      (sum, item) => sum + (item.totalAmount || 0),
      0,
    );

    const remainingMoney = customers.reduce(
      (sum, item) => sum + (item.remainingAmount || 0),
      0,
    );

    // =========================
    // إحصائيات المخزون
    // الإجمالي هنا = مجموع الكميات
    // =========================
    const inventoryItems = await prisma.inventoryItem.findMany({
      select: {
        itemType: true,
        quantity: true,
      },
    });

    const shirtsCount = inventoryItems
      .filter((item) => item.itemType === "SHIRT")
      .reduce((sum, item) => sum + (item.quantity || 0), 0);

    const bowtiesCount = inventoryItems
      .filter((item) => item.itemType === "BOWTIE")
      .reduce((sum, item) => sum + (item.quantity || 0), 0);

    const tiesCount = inventoryItems
      .filter((item) => item.itemType === "TIE")
      .reduce((sum, item) => sum + (item.quantity || 0), 0);

    const beltsCount = inventoryItems
      .filter((item) => item.itemType === "BELT")
      .reduce((sum, item) => sum + (item.quantity || 0), 0);

    const wideBeltsCount = inventoryItems
      .filter((item) => item.itemType === "WIDE_BELT")
      .reduce((sum, item) => sum + (item.quantity || 0), 0);

    const socksCount = inventoryItems
      .filter((item) => item.itemType === "SOCKS")
      .reduce((sum, item) => sum + (item.quantity || 0), 0);

    const shoesCount = inventoryItems
      .filter((item) => item.itemType === "SHOES")
      .reduce((sum, item) => sum + (item.quantity || 0), 0);

    return res.status(200).json({
      // العملاء
      totalCustomers,
      newCustomers,
      measuredCustomers,
      inProgressCustomers,
      readyCustomers,
      deliveredCustomers,

      // المال
      totalSales,
      remainingMoney,

      // المخزون
      shirtsCount,
      bowtiesCount,
      tiesCount,
      beltsCount,
      wideBeltsCount,
      socksCount,
      shoesCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
