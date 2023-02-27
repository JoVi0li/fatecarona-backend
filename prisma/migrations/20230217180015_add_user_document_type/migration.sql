/*
  Warnings:

  - Added the required column `type` to the `UserDocument` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserDocumentType" AS ENUM ('IDENTITY_DOCUMENT_FRONT', 'IDENTITY_DOCUMENT_BACK', 'COLLEGE_DOCUMENT');

-- AlterTable
ALTER TABLE "UserDocument" ADD COLUMN     "type" "UserDocumentType" NOT NULL;
