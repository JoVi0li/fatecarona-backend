-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "CourseTime" AS ENUM ('AM', 'PM');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('CREATED', 'WAITING_PARTICIPANTS', 'IN_PROGRESS', 'FINISHED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "phone" INTEGER NOT NULL,
    "identityDocument" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDocuments" (
    "id" TEXT NOT NULL,
    "docPhotoFrontUrl" TEXT NOT NULL,
    "docPhotoBackUrl" TEXT NOT NULL,
    "collegeDocUrl" TEXT NOT NULL,

    CONSTRAINT "UserDocuments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserValidations" (
    "id" TEXT NOT NULL,
    "isDocPhotoFrontValid" BOOLEAN NOT NULL,
    "isDocPhotoBackValid" BOOLEAN NOT NULL,
    "isCollegeDocValid" BOOLEAN NOT NULL,
    "isEmailVerified" BOOLEAN NOT NULL,

    CONSTRAINT "UserValidations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "College" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "localization" TEXT[],

    CONSTRAINT "College_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "time" "CourseTime" NOT NULL,
    "collegeId" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCollege" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userDocumentsId" TEXT NOT NULL,
    "userValidationsId" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,

    CONSTRAINT "UserCollege_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "bPoint" TEXT[],
    "collegeId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "status" "EventStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_event-participant" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "College_name_key" ON "College"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserCollege_userId_key" ON "UserCollege"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserCollege_userDocumentsId_key" ON "UserCollege"("userDocumentsId");

-- CreateIndex
CREATE UNIQUE INDEX "UserCollege_userValidationsId_key" ON "UserCollege"("userValidationsId");

-- CreateIndex
CREATE UNIQUE INDEX "UserCollege_collegeId_key" ON "UserCollege"("collegeId");

-- CreateIndex
CREATE UNIQUE INDEX "_event-participant_AB_unique" ON "_event-participant"("A", "B");

-- CreateIndex
CREATE INDEX "_event-participant_B_index" ON "_event-participant"("B");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCollege" ADD CONSTRAINT "UserCollege_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCollege" ADD CONSTRAINT "UserCollege_userDocumentsId_fkey" FOREIGN KEY ("userDocumentsId") REFERENCES "UserDocuments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCollege" ADD CONSTRAINT "UserCollege_userValidationsId_fkey" FOREIGN KEY ("userValidationsId") REFERENCES "UserValidations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCollege" ADD CONSTRAINT "UserCollege_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "UserCollege"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_event-participant" ADD CONSTRAINT "_event-participant_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_event-participant" ADD CONSTRAINT "_event-participant_B_fkey" FOREIGN KEY ("B") REFERENCES "UserCollege"("id") ON DELETE CASCADE ON UPDATE CASCADE;
