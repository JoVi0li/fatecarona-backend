/*
  Warnings:

  - Added the required column `salt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `identityDocument` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "salt" TEXT NOT NULL,
DROP COLUMN "identityDocument",
ADD COLUMN     "identityDocument" INTEGER NOT NULL;
