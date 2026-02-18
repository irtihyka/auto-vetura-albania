-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Listing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "fuel" TEXT NOT NULL,
    "transmission" TEXT NOT NULL,
    "km" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "color" TEXT,
    "vehicleType" TEXT NOT NULL DEFAULT 'Makinë',
    "bodyType" TEXT,
    "location" TEXT,
    "phone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "premium" BOOLEAN NOT NULL DEFAULT false,
    "premiumUntil" DATETIME,
    "views" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Listing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Listing" ("bodyType", "brand", "clicks", "color", "createdAt", "description", "featured", "fuel", "id", "km", "location", "model", "phone", "premium", "premiumUntil", "price", "status", "title", "transmission", "updatedAt", "userId", "views", "year") SELECT "bodyType", "brand", "clicks", "color", "createdAt", "description", "featured", "fuel", "id", "km", "location", "model", "phone", "premium", "premiumUntil", "price", "status", "title", "transmission", "updatedAt", "userId", "views", "year" FROM "Listing";
DROP TABLE "Listing";
ALTER TABLE "new_Listing" RENAME TO "Listing";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
