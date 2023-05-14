/*
  Warnings:

  - Made the column `user_id` on table `carts` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "carts_cupom_id_key";

-- DropIndex
DROP INDEX "carts_user_id_key";

-- AlterTable
ALTER TABLE "carts" ALTER COLUMN "user_id" SET NOT NULL;
