-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('NORMAL', 'ADMIN');

-- AlterTable
ALTER TABLE "UserCollege" ADD COLUMN     "role" "UserRoles" NOT NULL DEFAULT 'NORMAL';
