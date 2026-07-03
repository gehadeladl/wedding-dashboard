-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "bookingDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deliveryDate" DATETIME NOT NULL,
    "totalAmount" REAL,
    "paidAmount" REAL,
    "remainingAmount" REAL,
    "notes" TEXT,
    "isDelivered" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
