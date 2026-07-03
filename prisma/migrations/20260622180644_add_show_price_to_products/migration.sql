/*
  Warnings:

  - You are about to drop the column `isActive` on the `Product` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "categoryId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL,
    "showPrice" BOOLEAN NOT NULL DEFAULT true,
    "websiteSection" TEXT,
    "showOnHome" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("categoryId", "createdAt", "description", "displayOrder", "id", "name", "price", "showOnHome", "updatedAt", "websiteSection") SELECT "categoryId", "createdAt", "description", "displayOrder", "id", "name", "price", "showOnHome", "updatedAt", "websiteSection" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
