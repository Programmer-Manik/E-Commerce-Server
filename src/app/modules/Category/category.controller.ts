import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { CategoryService } from "./category.service";

const createCategory = catchAsync(async (req, res) => {
  const result = await CategoryService.createCategory(req.body as any);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Category create successfully",
    data: result,
  });
});

const getAllCategory = catchAsync(async (req, res) => {
  const result = await CategoryService.getAllCategory();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Category fetch successfully",
    data: result,
  });
});

const deleteCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CategoryService.deleteCategory(id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Category deletd successfully",
    data: result,
  });
});

const updateCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CategoryService.updateCategory(
    id as string,
    req.body as any
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Category update successfully",
    data: result,
  });
});

export const CategoryController = {
  createCategory,
  getAllCategory,
  deleteCategory,
  updateCategory,
};
