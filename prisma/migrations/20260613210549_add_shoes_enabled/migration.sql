-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CustomerMeasurement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "jacketLength" REAL,
    "sleeveLength" REAL,
    "armhole" REAL,
    "chest" REAL,
    "stomach" REAL,
    "jacketNotes" TEXT,
    "waist" REAL,
    "pantsLength" REAL,
    "thigh" REAL,
    "zipper" REAL,
    "calf" REAL,
    "legOpening" REAL,
    "halfHip" REAL,
    "circumference" REAL,
    "collarStyle" TEXT,
    "vestEnabled" BOOLEAN NOT NULL DEFAULT false,
    "vestCollar" TEXT,
    "vestButtons" TEXT,
    "shirtEnabled" BOOLEAN NOT NULL DEFAULT false,
    "shirtColor" TEXT,
    "shirtFit" TEXT,
    "shirtAccessory" TEXT,
    "bowtieEnabled" BOOLEAN NOT NULL DEFAULT false,
    "bowtieMaterial" TEXT,
    "bowtieSize" TEXT,
    "tieEnabled" BOOLEAN NOT NULL DEFAULT false,
    "tieNotes" TEXT,
    "tiePocketSquare" BOOLEAN NOT NULL DEFAULT false,
    "bouquetEnabled" BOOLEAN NOT NULL DEFAULT false,
    "socksEnabled" BOOLEAN NOT NULL DEFAULT false,
    "socksColor" TEXT,
    "wideBeltEnabled" BOOLEAN NOT NULL DEFAULT false,
    "wideBeltMaterial" TEXT,
    "wideBeltColor" TEXT,
    "beltEnabled" BOOLEAN NOT NULL DEFAULT false,
    "beltColor" TEXT,
    "beltMaterial" TEXT,
    "shoesStyle" TEXT,
    "shoesMaterial" TEXT,
    "fabricCategory" TEXT,
    "fabricOrigin" TEXT,
    "shoesEnabled" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "CustomerMeasurement_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CustomerMeasurement" ("armhole", "beltColor", "beltEnabled", "beltMaterial", "bouquetEnabled", "bowtieEnabled", "bowtieMaterial", "bowtieSize", "calf", "chest", "circumference", "collarStyle", "customerId", "fabricCategory", "fabricOrigin", "halfHip", "id", "jacketLength", "jacketNotes", "legOpening", "pantsLength", "shirtAccessory", "shirtColor", "shirtEnabled", "shirtFit", "shoesMaterial", "shoesStyle", "sleeveLength", "socksColor", "socksEnabled", "stomach", "thigh", "tieEnabled", "tieNotes", "tiePocketSquare", "vestButtons", "vestCollar", "vestEnabled", "waist", "wideBeltColor", "wideBeltEnabled", "wideBeltMaterial", "zipper") SELECT "armhole", "beltColor", "beltEnabled", "beltMaterial", "bouquetEnabled", "bowtieEnabled", "bowtieMaterial", "bowtieSize", "calf", "chest", "circumference", "collarStyle", "customerId", "fabricCategory", "fabricOrigin", "halfHip", "id", "jacketLength", "jacketNotes", "legOpening", "pantsLength", "shirtAccessory", "shirtColor", "shirtEnabled", "shirtFit", "shoesMaterial", "shoesStyle", "sleeveLength", "socksColor", "socksEnabled", "stomach", "thigh", "tieEnabled", "tieNotes", "tiePocketSquare", "vestButtons", "vestCollar", "vestEnabled", "waist", "wideBeltColor", "wideBeltEnabled", "wideBeltMaterial", "zipper" FROM "CustomerMeasurement";
DROP TABLE "CustomerMeasurement";
ALTER TABLE "new_CustomerMeasurement" RENAME TO "CustomerMeasurement";
CREATE UNIQUE INDEX "CustomerMeasurement_customerId_key" ON "CustomerMeasurement"("customerId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
