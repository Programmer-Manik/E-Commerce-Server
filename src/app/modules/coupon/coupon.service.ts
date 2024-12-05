import { UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";

const createCoupon = async (user: any, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.active,
    },
  });

  const result = await prisma.coupon.create({
    data: {
      vendorId: userData.id,
      discount: payload.discount,
      couponCode: payload.couponCode,
    },
  });

  return result;
};

const getVendorCoupon = async (user: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.active,
    },
  });

  const result = await prisma.coupon.findMany({
    where: {
      vendorId: userData.id,
    },
  });
  return result;
};

const getSingleCoupon = async (couponCode: string, payload: any) => {
  const result = await prisma.coupon.findUniqueOrThrow({
    where: {
      couponCode,
      vendorId: payload.vendorId,
    },
  });
  return result;
};

const deleteCoupon = async (usre: any, id: string) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: usre.email,
      status: UserStatus.active,
    },
  });

  const result = await prisma.coupon.delete({
    where: {
      id,
      vendorId: userData.id,
    },
  });
  return result;
};

export const CouponService = {
  createCoupon,
  getVendorCoupon,
  getSingleCoupon,
  deleteCoupon,
};
