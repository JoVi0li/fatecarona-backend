/*
  Warnings:

  - You are about to drop the column `collegeId` on the `Event` table. All the data in the column will be lost.
  - Added the required column `aPointId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_collegeId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "collegeId",
ADD COLUMN     "aPointId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_aPointId_fkey" FOREIGN KEY ("aPointId") REFERENCES "College"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
