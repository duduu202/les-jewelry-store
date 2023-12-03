/*
  Warnings:

  - A unique constraint covering the columns `[charge_address_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[delivery_address_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "addresses" ADD COLUMN     "name" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "users_charge_address_id_key" ON "users"("charge_address_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_delivery_address_id_key" ON "users"("delivery_address_id");
