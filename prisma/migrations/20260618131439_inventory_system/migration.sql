/*
  Warnings:

  - You are about to drop the `ShirtInventory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ShirtInventory";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemType" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
