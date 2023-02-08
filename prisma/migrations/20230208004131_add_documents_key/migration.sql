/*
  Warnings:

  - A unique constraint covering the columns `[docPhotoFrontKey]` on the table `UserDocuments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[docPhotoBackKey]` on the table `UserDocuments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[collegeDocKey]` on the table `UserDocuments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `collegeDocKey` to the `UserDocuments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `docPhotoBackKey` to the `UserDocuments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `docPhotoFrontKey` to the `UserDocuments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserDocuments" ADD COLUMN     "collegeDocKey" TEXT NOT NULL,
ADD COLUMN     "docPhotoBackKey" TEXT NOT NULL,
ADD COLUMN     "docPhotoFrontKey" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserDocuments_docPhotoFrontKey_key" ON "UserDocuments"("docPhotoFrontKey");

-- CreateIndex
CREATE UNIQUE INDEX "UserDocuments_docPhotoBackKey_key" ON "UserDocuments"("docPhotoBackKey");

-- CreateIndex
CREATE UNIQUE INDEX "UserDocuments_collegeDocKey_key" ON "UserDocuments"("collegeDocKey");
