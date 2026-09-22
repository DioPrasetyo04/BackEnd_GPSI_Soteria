-- CreateEnum
CREATE TYPE "OrganizationCategory" AS ENUM ('PENGURUS_HARIAN', 'KOORDINATOR_SEKTOR');

-- CreateTable
CREATE TABLE "OrganizationMember" (
    "id" TEXT NOT NULL,
    "category" "OrganizationCategory" NOT NULL,
    "position" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "fax" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrganizationMember_category_idx" ON "OrganizationMember"("category");

-- CreateIndex
CREATE INDEX "OrganizationMember_order_idx" ON "OrganizationMember"("order");
