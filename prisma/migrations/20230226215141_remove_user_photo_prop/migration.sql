/*
  Warnings:

  - You are about to drop the column `photo` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `photoKey` on the `User` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "UserDocumentType" ADD VALUE 'PHOTO';

-- DropIndex
DROP INDEX "User_photoKey_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "photo",
DROP COLUMN "photoKey";
