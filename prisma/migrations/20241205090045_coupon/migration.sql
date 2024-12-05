-- CreateTable
CREATE TABLE "coupon" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "couponCode" TEXT NOT NULL,
    "discount" INTEGER NOT NULL,

    CONSTRAINT "coupon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "coupon_couponCode_key" ON "coupon"("couponCode");
