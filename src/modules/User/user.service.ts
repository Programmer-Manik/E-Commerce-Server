import { UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";

const createUser = async (payload: any) => {
  const hashedPassord: string = await bcrypt.hash(payload.password, 12);
  payload.password = hashedPassord;

  if (payload?.role && payload?.role == "admin") {
    payload.role = "customer";
  }

  const result = await prisma.user.create({
    data: payload,
  });
  return result;
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
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      contactNumber: true,
      address: true,
      profilePhoto: true,
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
      shop: true,
    },
  });

  return result;
};

export const UserService = {
  createUser,
  createAdmin,
  getAllUsers,
  getSingleUser,
};
