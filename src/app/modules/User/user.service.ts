import { UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import { jwtHelpers } from "../../../helpars/jwtHelpers";
import { Secret } from "jsonwebtoken";
import configs from "../../../configs";

const createUser = async (payload: any) => {
  const hashedPassord: string = await bcrypt.hash(payload.password, 12);
  payload.password = hashedPassord;

  if (payload?.role && payload?.role == "admin") {
    payload.role = "customer";
  }

  const result = await prisma.user.create({
    data: payload,
  });

  const accessToken = jwtHelpers.generateToken(
    { email: payload.email, role: payload.role },
    configs.jwt.jwt_secret as Secret,
    configs.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    { email: payload.email, role: payload.role },
    configs.jwt.refresh_token_secret as Secret,
    configs.jwt.refresh_token_expires_in as string
  );
  return { result, accessToken, refreshToken };
};

const createAdmin = async (payload: any) => {
  const hashedPassord: string = await bcrypt.hash(payload.password, 12);
  payload.password = hashedPassord;

  payload.role = "admin";

  const result = await prisma.user.create({
    data: payload,
  });
  return result;
};

const getAllUsers = async () => {
  const result = await prisma.user.findMany({
    where: {
      status: { notIn: [UserStatus.deleted] },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      contactNumber: true,
      address: true,
      profilePhoto: true,
      status: true,
    },
    orderBy: {
      cretedAt: "desc",
    },
  });

  return result;
};

const getSingleUser = async (user: any) => {
  const result = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.active,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      contactNumber: true,
      address: true,
      profilePhoto: true,
      status: true,
      shop: true,
    },
  });

  return result;
};

const updateSingleUser = async (id: string, payload: any) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
  });

  if (result.role == "vendor" && result.status == "deleted") {
    const findShop = await prisma.shop.findUnique({
      where: {
        userId: id,
      },
    });
    if (findShop) {
      const res = await prisma.shop.update({
        where: {
          userId: id,
        },
        data: {
          isDeleted: true,
        },
      });
    }
  }

  return result;
};

const softDeleteUser = async (id: string) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.user.update({
    where: {
      id,
    },
    data: {
      status: UserStatus.deleted,
    },
  });

  if (userData.role == "vendor") {
    try {
      const shopData = await prisma.shop.findUnique({
        where: {
          userId: id,
        },
      });
      if (shopData?.id) {
        const deleteAllProduct = await prisma.product.updateMany({
          where: {
            shopId: shopData?.id,
          },
          data: {
            isDeleted: true,
          },
        });
      }
      const deleteOrder = await prisma.followUnfollow.deleteMany({
        where: {
          shopId: shopData?.id,
        },
      });
      const deleteOrderProduct = await prisma.cartItem.deleteMany({
        where: {
          userEmail: userData?.email,
        },
      });
      const deleteShop = await prisma.shop.delete({
        where: {
          id: shopData?.id,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }
  return result;
};

const blockedUser = async (id: string) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.user.update({
    where: {
      id,
    },
    data: {
      status: UserStatus.blocked,
    },
  });

  if (userData.role == "vendor") {
    try {
      const shopData = await prisma.shop.findUnique({
        where: {
          userId: id,
        },
      });
      if (shopData?.id) {
        const deleteAllProduct = await prisma.product.updateMany({
          where: {
            shopId: shopData?.id,
          },
          data: {
            isDeleted: true,
          },
        });
      }
      const deleteOrderProduct = await prisma.cartItem.deleteMany({
        where: {
          userEmail: userData?.email,
        },
      });
      const deleteShop = await prisma.shop.update({
        where: {
          id: shopData?.id,
        },
        data: {
          isDeleted: true,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }
  return result;
};

const unblockedUser = async (id: string) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.user.update({
    where: {
      id,
    },
    data: {
      status: UserStatus.active,
    },
  });


  if (userData.role == "vendor") {
    try {
      const shopData = await prisma.shop.findUnique({
        where: {
          userId: id,
        },
      });
      if (shopData?.id) {
        const deleteAllProduct = await prisma.product.updateMany({
          where: {
            shopId: shopData?.id,
          },
          data: {
            isDeleted: false,
          },
        });
      }
      const deleteShop = await prisma.shop.update({
        where: {
          id: shopData?.id,
        },
        data: {
          isDeleted: false,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }
  return result;
};

export const UserService = {
  createUser,
  createAdmin,
  getAllUsers,
  getSingleUser,
  updateSingleUser,
  softDeleteUser,
  blockedUser,
  unblockedUser
};
