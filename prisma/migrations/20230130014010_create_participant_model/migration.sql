/*
  Warnings:

  - You are about to drop the `_event-participant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_event-participant" DROP CONSTRAINT "_event-participant_A_fkey";

-- DropForeignKey
ALTER TABLE "_event-participant" DROP CONSTRAINT "_event-participant_B_fkey";

-- DropTable
DROP TABLE "_event-participant";

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventId" TEXT NOT NULL,
    "userCollegeId" TEXT NOT NULL,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_userCollegeId_fkey" FOREIGN KEY ("userCollegeId") REFERENCES "UserCollege"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
