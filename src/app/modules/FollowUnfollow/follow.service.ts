import { UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";

const createFollow = async (user: any, shopId: string) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.active,
    },
  });

  const shopData = await prisma.shop.findUniqueOrThrow({
    where: {
      id: shopId,
      isDeleted: false,
    },
  });

  const result = await prisma.followUnfollow.create({
    data: {
      folowerEmail: userData.id,
      shopId: shopData.id,
    },
  });

  return result;
};

const createUnfollow = async (user: any, shopId: string) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.active,
    },
  });

  const shopData = await prisma.shop.findUniqueOrThrow({
    where: {
      id: shopId,
      isDeleted: false,
    },
  });

  const result = await prisma.followUnfollow.delete({
    where: {
      shopId_folowerEmail: {
        folowerEmail: userData.id,
        shopId: shopData.id,
      },
    },
  });

  return result;
};

const shopFollowCount = async (shopId: string) => {
  const result = await prisma.followUnfollow.count({
    where: {
      shopId: shopId,
    },
  });

  return result;
};

const checkMyFollow = async (user: any, shopId: string) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.active,
    },
  });
  const result = await prisma.followUnfollow.findUnique({
    where: {
      shopId_folowerEmail: {
        folowerEmail: userData.id,
        shopId: shopId,
      },
    },
  });

  if (result) {
    return true;
  } else {
    return false;
  }

};

export const FollowerService = {
  createFollow,
  createUnfollow,
  shopFollowCount,
  checkMyFollow,
};
