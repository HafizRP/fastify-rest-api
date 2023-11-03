-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'VERIFIED');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'VERIFIED';
