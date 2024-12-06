import prisma from "../../../shared/prisma";

const createCategory = async (payload: any) => {
  const result = await prisma.category.create({
    data: {
      ...payload,
    },
  });
  return result;
};

const getAllCategory = async () => {
  const result = await prisma.category.findMany();
  return result;
};

const deleteCategory = async (id: string) => {
  const result = await prisma.category.delete({
    where: {
      id,
    },
  });
  return result;
};

const updateCategory = async (id: string, payload: any) => {
  const result = await prisma.category.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

export const CategoryService = {
  createCategory,
  getAllCategory,
  deleteCategory,
  updateCategory,
};
