/*
  Warnings:

  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Organization";

-- CreateTable
CREATE TABLE "organization" (
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

    CONSTRAINT "organization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "organization_category_idx" ON "organization"("category");

-- CreateIndex
CREATE INDEX "organization_order_idx" ON "organization"("order");
