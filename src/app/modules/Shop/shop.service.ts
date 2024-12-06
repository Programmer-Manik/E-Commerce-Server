import { UserRole, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";

const createShop = async (user: any, payload: any) => {
  const vendorData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      role: UserRole.vendor,
      status: UserStatus.active,
    },
  });

  const result = await prisma.shop.create({
    data: { ...payload, userId: vendorData.id },
  });
  return result;
};

const getAllShop = async () => {
  const result = await prisma.shop.findMany({
    where: {
      isDeleted: false,
    },
    //    select: {
    //     id: true,
    //     name: true,
    //     title: true,
    //     userId: true,
    //     logo: true,
    //     followers: true,
    //    }
  });

  return result;
};

const getById = async (id: string) => {
  let result;
  result = await prisma.shop.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!result) {
    result = await prisma.shop.findFirstOrThrow({
      where: {
        userId: id,
        isDeleted: false,
      },
    });
  }

  return result;
};

const softDelete = async (user: any, id: string) => {
  const vendorData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.active,
    },
  });

  if (user && user.role != "admin") {
    await prisma.shop.findUniqueOrThrow({
      where: {
        id,
        userId: vendorData.id,
      },
    });
  }

  const result = await prisma.shop.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });
  return result;
};

const deleteShop = async (id: string) => {
  const result = await prisma.shop.delete({
    where: {
      id,
    },
  });
  return result;
};

const updateShop = async (user: any, payload: any) => {
  const vendorData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.active,
    },
  });

  const shopInfo = await prisma.shop.findUniqueOrThrow({
    where: {
      userId: vendorData.id,
      isDeleted: false,
    },
  });

  const result = await prisma.shop.update({
    where: {
      id: shopInfo.id,
    },
    data: {
      ...payload,
    },
  });
  return result;

};

export const ShopService = {
  createShop,
  getAllShop,
  getById,
  softDelete,
  deleteShop,
  updateShop,
};
