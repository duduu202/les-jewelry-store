/*
  Warnings:

  - A unique constraint covering the columns `[cupom_id]` on the table `carts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Paid_status" AS ENUM ('PAID', 'NOT_PAID', 'REFUNDED');

-- AlterTable
ALTER TABLE "carts" ADD COLUMN     "cupom_id" TEXT,
ADD COLUMN     "paid_status" "Paid_status" NOT NULL DEFAULT 'NOT_PAID';

-- CreateIndex
CREATE UNIQUE INDEX "carts_cupom_id_key" ON "carts"("cupom_id");
