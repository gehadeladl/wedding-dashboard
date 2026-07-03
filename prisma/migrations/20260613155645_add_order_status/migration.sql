-- CreateTable
CREATE TABLE "CustomerMeasurement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "chest" REAL,
    "waist" REAL,
    "hip" REAL,
    "shoulder" REAL,
    "sleeve" REAL,
    "length" REAL,
    CONSTRAINT "CustomerMeasurement_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Customer" (
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
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "measurementsCompleted" BOOLEAN NOT NULL DEFAULT false,
    "orderStatus" TEXT NOT NULL DEFAULT 'NEW'
);
INSERT INTO "new_Customer" ("bookingDate", "createdAt", "deliveryDate", "id", "isDelivered", "name", "notes", "paidAmount", "phone", "remainingAmount", "totalAmount", "updatedAt") SELECT "bookingDate", "createdAt", "deliveryDate", "id", "isDelivered", "name", "notes", "paidAmount", "phone", "remainingAmount", "totalAmount", "updatedAt" FROM "Customer";
DROP TABLE "Customer";
ALTER TABLE "new_Customer" RENAME TO "Customer";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "CustomerMeasurement_customerId_key" ON "CustomerMeasurement"("customerId");
