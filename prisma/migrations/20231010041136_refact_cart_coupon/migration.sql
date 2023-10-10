-- DropForeignKey
ALTER TABLE "carts" DROP CONSTRAINT "carts_cupom_id_fkey";

-- CreateTable
CREATE TABLE "cart_coupons" (
    "id" TEXT NOT NULL,
    "cart_id" TEXT,
    "coupon_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cart_coupons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cart_coupons_cart_id_key" ON "cart_coupons"("cart_id");

-- CreateIndex
CREATE UNIQUE INDEX "cart_coupons_cart_id_coupon_id_key" ON "cart_coupons"("cart_id", "coupon_id");

-- AddForeignKey
ALTER TABLE "cart_coupons" ADD CONSTRAINT "cart_coupons_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_coupons" ADD CONSTRAINT "cart_coupons_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "coupons"("id") ON DELETE SET NULL ON UPDATE CASCADE;
