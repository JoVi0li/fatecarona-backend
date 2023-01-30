/*
  Warnings:

  - Added the required column `fromTo` to the `UserCollege` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FromTo" AS ENUM ('FROM_A_TO_B', 'FROM_B_TO_A');

-- AlterTable
ALTER TABLE "UserCollege" ADD COLUMN     "fromTo" "FromTo" NOT NULL;
