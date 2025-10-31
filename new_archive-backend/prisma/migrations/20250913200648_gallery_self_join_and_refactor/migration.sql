-- CreateTable
CREATE TABLE "Gallery" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "coverImage" TEXT,
    "parentId" INTEGER,
    CONSTRAINT "Gallery_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Gallery" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "File" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "galleryId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    CONSTRAINT "File_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "Gallery" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
