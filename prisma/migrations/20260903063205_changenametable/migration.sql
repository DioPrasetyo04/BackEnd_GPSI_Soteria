/*
  Warnings:

  - You are about to drop the `OrganizationMember` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "OrganizationMember";

-- CreateTable
CREATE TABLE "Organization" (
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

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Organization_category_idx" ON "Organization"("category");

-- CreateIndex
CREATE INDEX "Organization_order_idx" ON "Organization"("order");
