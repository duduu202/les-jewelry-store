-- AlterTable
ALTER TABLE "products" ADD COLUMN     "category" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "charge_address_id" TEXT,
ADD COLUMN     "delivery_address_id" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_charge_address_id_fkey" FOREIGN KEY ("charge_address_id") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_delivery_address_id_fkey" FOREIGN KEY ("delivery_address_id") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
