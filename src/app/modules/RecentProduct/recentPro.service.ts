import { UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";

const getByUserId = async (userId: string) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
      status: UserStatus.active,
    },
  });

  const result = await prisma.recentProductShow.findUnique({
    where: {
      userId,
    },
  });

  let products;
  if (result) {
    products = await prisma.product.findMany({
      where: {
        id: { in: result.productIds },
      },
    });
  } else {
    console.log("No recent products found for this user.");
  }

  return products;
};

export const RecentProductService = {
  getByUserId,
};
