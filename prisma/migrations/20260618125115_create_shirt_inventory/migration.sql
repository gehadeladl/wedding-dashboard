-- CreateTable
CREATE TABLE "ShirtInventory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "size" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "accessoryType" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
