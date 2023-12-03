/*
  Warnings:

  - You are about to drop the column `address_id` on the `carts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "carts" DROP CONSTRAINT "carts_address_id_fkey";

-- AlterTable
-- ALTER TABLE "carts" DROP COLUMN "address_id",

-- intead of dropping the column, we rename it to keep the data
ALTER TABLE "carts" RENAME COLUMN "address_id" TO "delivery_address_id";
-- the charge address is going to be the same as the delivery address
ALTER TABLE "carts" ADD COLUMN "charge_address_id" TEXT;
UPDATE "carts" SET "charge_address_id" = "delivery_address_id";

-- ADD COLUMN     "charge_address_id" TEXT,
-- ADD COLUMN     "delivery_address_id" TEXT;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_charge_address_id_fkey" FOREIGN KEY ("charge_address_id") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_delivery_address_id_fkey" FOREIGN KEY ("delivery_address_id") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
