-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Gallery" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "coverImage" TEXT,
    "parentId" INTEGER,
    "type" TEXT,
    "link" TEXT,
    "likes" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Gallery_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Gallery" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Gallery" ("coverImage", "description", "id", "link", "parentId", "title", "type") SELECT "coverImage", "description", "id", "link", "parentId", "title", "type" FROM "Gallery";
DROP TABLE "Gallery";
ALTER TABLE "new_Gallery" RENAME TO "Gallery";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
