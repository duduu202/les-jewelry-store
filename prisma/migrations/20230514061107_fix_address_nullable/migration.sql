-- DropForeignKey
ALTER TABLE "carts" DROP CONSTRAINT "carts_address_id_fkey";

-- AlterTable
ALTER TABLE "carts" ALTER COLUMN "address_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
