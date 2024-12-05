-- CreateTable
CREATE TABLE "recent_product_show" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productIds" TEXT[],

    CONSTRAINT "recent_product_show_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "recent_product_show_userId_key" ON "recent_product_show"("userId");

-- AddForeignKey
ALTER TABLE "recent_product_show" ADD CONSTRAINT "recent_product_show_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
