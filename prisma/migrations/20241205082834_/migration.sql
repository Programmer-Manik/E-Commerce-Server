/*
  Warnings:

  - A unique constraint covering the columns `[userEmail]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userEmail` to the `CartItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "userEmail" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_userEmail_key" ON "CartItem"("userEmail");

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
