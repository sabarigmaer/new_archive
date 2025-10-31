-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_File" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "galleryId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "File_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "Gallery" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_File" ("galleryId", "id", "likes", "name", "url") SELECT "galleryId", "id", coalesce("likes", 0) AS "likes", "name", "url" FROM "File";
DROP TABLE "File";
ALTER TABLE "new_File" RENAME TO "File";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
