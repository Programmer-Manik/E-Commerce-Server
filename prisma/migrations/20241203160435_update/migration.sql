/*
  Warnings:

  - The primary key for the `FollowUnfollow` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `FollowUnfollow` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FollowUnfollow" DROP CONSTRAINT "FollowUnfollow_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "FollowUnfollow_pkey" PRIMARY KEY ("shopId", "folowerEmail");
