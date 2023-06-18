-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_cupom_id_fkey" FOREIGN KEY ("cupom_id") REFERENCES "coupons"("id") ON DELETE SET NULL ON UPDATE CASCADE;
