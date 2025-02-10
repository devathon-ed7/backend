/*
  Warnings:

  - You are about to drop the column `user_id` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User_details` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User_accounts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `price` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `User_accounts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_user_id_fkey";

-- DropForeignKey
ALTER TABLE "User_details" DROP CONSTRAINT "User_details_user_account_id_fkey";

-- DropIndex
DROP INDEX "User_details_role_id_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "user_id",
ADD COLUMN     "code" TEXT,
ADD COLUMN     "images" TEXT,
ADD COLUMN     "price" INTEGER NOT NULL,
ADD COLUMN     "sold" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "notes" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User_accounts" ADD COLUMN     "email" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User_details" DROP COLUMN "email";

-- CreateTable
CREATE TABLE "InventoryTransaction" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "transaction_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_code_key" ON "Product"("code");

-- CreateIndex
CREATE UNIQUE INDEX "User_accounts_email_key" ON "User_accounts"("email");

-- AddForeignKey
ALTER TABLE "User_details" ADD CONSTRAINT "User_details_user_account_id_fkey" FOREIGN KEY ("user_account_id") REFERENCES "User_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransaction" ADD CONSTRAINT "InventoryTransaction_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
