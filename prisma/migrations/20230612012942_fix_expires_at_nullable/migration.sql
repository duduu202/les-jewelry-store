-- AlterTable
ALTER TABLE "carts" ALTER COLUMN "expires_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "coupons" ALTER COLUMN "expires_at" DROP NOT NULL;
