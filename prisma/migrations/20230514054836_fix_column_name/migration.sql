/*
  Warnings:

  - You are about to drop the column `available_until` on the `coupons` table. All the data in the column will be lost.
  - Added the required column `expires_at` to the `coupons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "coupons" DROP COLUMN "available_until",
ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL;
