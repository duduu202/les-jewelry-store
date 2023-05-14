/*
  Warnings:

  - Added the required column `expires_at` to the `carts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "carts" ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "payment_cards" ADD COLUMN     "cartId" TEXT;

-- CreateTable
CREATE TABLE "cart_payment_cards" (
    "id" TEXT NOT NULL,
    "cart_id" TEXT,
    "payment_card_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cart_payment_cards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cart_payment_cards_cart_id_key" ON "cart_payment_cards"("cart_id");

-- CreateIndex
CREATE UNIQUE INDEX "cart_payment_cards_cart_id_payment_card_id_key" ON "cart_payment_cards"("cart_id", "payment_card_id");

-- AddForeignKey
ALTER TABLE "cart_payment_cards" ADD CONSTRAINT "cart_payment_cards_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_payment_cards" ADD CONSTRAINT "cart_payment_cards_payment_card_id_fkey" FOREIGN KEY ("payment_card_id") REFERENCES "payment_cards"("id") ON DELETE SET NULL ON UPDATE CASCADE;
