-- CreateTable
CREATE TABLE "HomeSlider" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "imageUrl" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "websiteSection" TEXT,
    "showOnHome" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("categoryId", "createdAt", "description", "id", "isActive", "name", "price", "updatedAt") SELECT "categoryId", "createdAt", "description", "id", "isActive", "name", "price", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
