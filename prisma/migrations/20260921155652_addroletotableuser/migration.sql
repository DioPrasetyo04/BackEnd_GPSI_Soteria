-- CreateEnum
CREATE TYPE "roleUser" AS ENUM ('ADMIN', 'SUPER_ADMIN', 'PENGELOLA', 'KOORSEK', 'PHMJ', 'MAJELIS');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "roleUser" NOT NULL DEFAULT 'PENGELOLA';

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");
