/*
  Warnings:

  - You are about to drop the column `username` on the `User_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User_details` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_accounts_username_key";

-- AlterTable
ALTER TABLE "User_accounts" DROP COLUMN "username",
ADD COLUMN     "full_name" TEXT;

-- AlterTable
ALTER TABLE "User_details" DROP COLUMN "name";
