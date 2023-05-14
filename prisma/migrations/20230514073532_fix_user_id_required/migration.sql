/*
  Warnings:

  - Made the column `user_id` on table `payment_cards` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "payment_cards" DROP CONSTRAINT "payment_cards_user_id_fkey";

-- DropIndex
DROP INDEX "payment_cards_user_id_key";

-- AlterTable
ALTER TABLE "payment_cards" ALTER COLUMN "user_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "payment_cards" ADD CONSTRAINT "payment_cards_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
