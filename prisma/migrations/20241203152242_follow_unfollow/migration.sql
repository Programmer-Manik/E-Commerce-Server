-- CreateTable
CREATE TABLE "FollowUnfollow" (
    "shopId" TEXT NOT NULL,
    "folowerEmail" TEXT NOT NULL,

    CONSTRAINT "FollowUnfollow_pkey" PRIMARY KEY ("shopId","folowerEmail")
);

-- AddForeignKey
ALTER TABLE "FollowUnfollow" ADD CONSTRAINT "FollowUnfollow_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUnfollow" ADD CONSTRAINT "FollowUnfollow_folowerEmail_fkey" FOREIGN KEY ("folowerEmail") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
