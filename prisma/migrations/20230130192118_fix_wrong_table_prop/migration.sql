/*
  Warnings:

  - You are about to drop the column `fromTo` on the `UserCollege` table. All the data in the column will be lost.
  - Added the required column `fromTo` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "fromTo" "FromTo" NOT NULL;

-- AlterTable
ALTER TABLE "UserCollege" DROP COLUMN "fromTo";
