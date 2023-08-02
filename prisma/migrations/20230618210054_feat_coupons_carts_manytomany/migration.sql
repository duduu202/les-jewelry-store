-- CreateTable
CREATE TABLE "coupon_carts" (
    "id" TEXT NOT NULL,
    "cart_id" TEXT NOT NULL,
    "coupon_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coupon_carts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "coupon_carts_cart_id_coupon_id_key" ON "coupon_carts"("cart_id", "coupon_id");

-- AddForeignKey
ALTER TABLE "coupon_carts" ADD CONSTRAINT "coupon_carts_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon_carts" ADD CONSTRAINT "coupon_carts_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "coupons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
