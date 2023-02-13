/*
  Warnings:

  - You are about to drop the column `userDocumentsId` on the `UserCollege` table. All the data in the column will be lost.
  - You are about to drop the column `userValidationsId` on the `UserCollege` table. All the data in the column will be lost.
  - You are about to drop the `UserDocuments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserValidations` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[photoKey]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `photoKey` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserCollege" DROP CONSTRAINT "UserCollege_userDocumentsId_fkey";

-- DropForeignKey
ALTER TABLE "UserCollege" DROP CONSTRAINT "UserCollege_userValidationsId_fkey";

-- DropIndex
DROP INDEX "UserCollege_userDocumentsId_key";

-- DropIndex
DROP INDEX "UserCollege_userValidationsId_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "photoKey" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserCollege" DROP COLUMN "userDocumentsId",
DROP COLUMN "userValidationsId";

-- DropTable
DROP TABLE "UserDocuments";

-- DropTable
DROP TABLE "UserValidations";

-- CreateTable
CREATE TABLE "UserDocument" (
    "id" TEXT NOT NULL,
    "userCollegeId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "isValid" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_photoKey_key" ON "User"("photoKey");

-- AddForeignKey
ALTER TABLE "UserDocument" ADD CONSTRAINT "UserDocument_userCollegeId_fkey" FOREIGN KEY ("userCollegeId") REFERENCES "UserCollege"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
