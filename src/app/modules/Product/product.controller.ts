import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ProductService } from "./product.service";
import pick from "../../../shared/pick";
import { productFilterableFields } from "./product.constant";

const createProduct = catchAsync(async (req, res) => {
  const user = (req as any).user;
  const result = await ProductService.createProduct(user, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Product create successfully",
    data: result,
  });
});

const getAllProduct = catchAsync(async (req, res) => {
  const filters = pick(req.query, productFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await ProductService.getAllProduct(filters, options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Products retrieved successfully",
    data: result,
  });
});

const getById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;
  const result = await ProductService.getById(id as string, userId as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Product retrieved successfully",
    data: result,
  });
});

const getMyProduct = catchAsync(async (req, res) => {
  const user = (req as any).user;
  const result = await ProductService.getMyProduct(user as any);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Product retrieved successfully",
    data: result,
  });
});

const softDelete = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = (req as any).user;
  const result = await ProductService.softDelete(user, id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Product deleted successfully",
    data: null,
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProductService.deleteProduct(id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Product deleted successfully",
    data: result,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = (req as any).user;
  const result = await ProductService.updateProduct(
    id as string,
    req.body as any,
    user as any
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Product updated successfully",
    data: result,
  });
});

const getProductsByShopId = catchAsync(async (req, res) => {
  const { shopId } = req.params;
  const { limit } = req.query;
  const result = await ProductService.getProductsByShopId(
    shopId as string,
    Number(limit)
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Product fetch successfully",
    data: result,
  });
});

export const ProductController = {
  createProduct,
  getAllProduct,
  getById,
  softDelete,
  deleteProduct,
  getMyProduct,
  updateProduct,
  getProductsByShopId,
};
