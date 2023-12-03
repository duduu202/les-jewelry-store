/*
  Warnings:

  - You are about to drop the column `is_current` on the `carts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[current_cart_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "carts" DROP COLUMN "is_current";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "current_cart_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_current_cart_id_key" ON "users"("current_cart_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_current_cart_id_fkey" FOREIGN KEY ("current_cart_id") REFERENCES "carts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
