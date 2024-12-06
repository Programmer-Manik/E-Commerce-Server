import { Prisma, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { productSearchAbleFields } from "./product.constant";

const createProduct = async (user: any, payload: any) => {
  const vendorData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.active,
    },
  });

  const shopData = await prisma.shop.findUniqueOrThrow({
    where: {
      userId: vendorData.id,
      isDeleted: false,
    },
  });

  const result = await prisma.product.create({
    data: { ...payload, userId: vendorData.id, shopId: shopData.id },
  });

  return result;
};

const getAllProduct = async (params: any, options: any) => {
  const { searchTerm, ...filterData } = params;
  //   console.log(filterData); //* aikhane upore destracture korar karone, searchTerm bade onno gulu show korbe
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePaginatin(options);
  // console.log({ limit, page, sortBy, sortOrder });

  const andConditions: Prisma.ProductWhereInput[] = [];

  if (params.searchTerm) {
    andConditions.push({
      OR: productSearchAbleFields.map((field) => ({
        [field]: {
          contains: params?.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  //   console.log(Object.keys(filterData)); // aikhane key gulu array akare debe
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  andConditions.push({
    isDeleted: false,
  });

  //   console.dir(andConditions, {depth: 'indinity'})

  const whereContitions: Prisma.ProductWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  //   console.log({whereContitions})
  const result = await prisma.product.findMany({
    where: whereContitions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : {
            cretedAt: "desc",
          },
  });

  return result;
};

const getMyProduct = async (user: any) => {
  const vendorData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.active,
    },
  });
  const result = await prisma.product.findMany({
    where: {
      userId: vendorData.id,
      isDeleted: false,
    },
    orderBy: {
      cretedAt: "desc",
    },
  });

  return result;
};

const getById = async (id: string, userId: string) => {
  const result = await prisma.product.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      shop: true,
    },
  });

  try {
    if (userId) {
      const existingRecord = await prisma.recentProductShow.findUnique({
        where: { userId },
      });

      let updatedProductIds = existingRecord
        ? existingRecord.productIds.filter((id) => id !== result.id)
        : [];

      updatedProductIds.push(result.id);

      updatedProductIds = updatedProductIds.slice(-10);

      await prisma.recentProductShow.upsert({
        where: { userId },
        update: {
          productIds: updatedProductIds,
        },
        create: {
          userId,
          productIds: updatedProductIds,
        },
      });
    }
  } catch (err) {
    console.log(err);
  }

  return result;
};

const softDelete = async (user: any, id: string) => {
  console.log(user, id);
  const vendorData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.active,
    },
  });

  if (user && user.role != "admin") {
    await prisma.product.findUniqueOrThrow({
      where: {
        id,
        userId: vendorData.id,
      },
    });
  }

  const result = await prisma.product.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });
  return result;
};

const deleteProduct = async (id: string) => {
  const result = await prisma.product.delete({
    where: {
      id,
    },
  });
  return result;
};

const updateProduct = async (id: string, payload: any, user: any) => {
  const vendorData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.active,
    },
  });
  await prisma.product.findUniqueOrThrow({
    where: {
      id,
      userId: vendorData.id,
    },
  });

  const result = await prisma.product.update({
    where: {
      id,
    },
    data: {
      ...payload,
    },
  });
  return result;
};

const getProductsByShopId = async (shopId: string, limit: number) => {
  await prisma.shop.findUniqueOrThrow({
    where: {
      id: shopId,
      isDeleted: false,
    },
  });

  const result = await prisma.product.findMany({
    where: {
      shopId,
      isDeleted: false,
    },
    take: limit || 10,
    orderBy: {
      cretedAt: "desc",
    },
  });

  return result;
};

export const ProductService = {
  createProduct,
  getAllProduct,
  getById,
  softDelete,
  deleteProduct,
  getMyProduct,
  updateProduct,
  getProductsByShopId,
};
