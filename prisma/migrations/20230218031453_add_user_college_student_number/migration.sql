/*
  Warnings:

  - A unique constraint covering the columns `[studentNumber]` on the table `UserCollege` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `studentNumber` to the `UserCollege` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserCollege" ADD COLUMN     "studentNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserCollege_studentNumber_key" ON "UserCollege"("studentNumber");
