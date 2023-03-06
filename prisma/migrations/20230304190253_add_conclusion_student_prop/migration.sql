/*
  Warnings:

  - Added the required column `conclusion` to the `UserCollege` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserCollege" ADD COLUMN     "conclusion" TIMESTAMP(3) NOT NULL;
