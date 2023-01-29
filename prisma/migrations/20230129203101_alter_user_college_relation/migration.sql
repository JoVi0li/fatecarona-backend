/*
  Warnings:

  - You are about to drop the column `collegeId` on the `UserCollege` table. All the data in the column will be lost.
  - Added the required column `courseId` to the `UserCollege` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserCollege" DROP CONSTRAINT "UserCollege_collegeId_fkey";

-- DropIndex
DROP INDEX "UserCollege_collegeId_key";

-- AlterTable
ALTER TABLE "UserCollege" DROP COLUMN "collegeId",
ADD COLUMN     "courseId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "UserCollege" ADD CONSTRAINT "UserCollege_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
