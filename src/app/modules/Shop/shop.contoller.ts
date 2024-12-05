import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import prisma from "../../../shared/prisma";
import sendResponse from "../../../shared/sendResponse";
import { ShopService } from "./shop.service";

const createShop = catchAsync(async (req, res) => {
  const user = (req as any).user;
  const result = await ShopService.createShop(user, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Shop create successfully",
    data: result,
  });
});

const getAllShop = catchAsync(async (req, res) => {
  const result = await ShopService.getAllShop();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Shop retrieved successfully",
    data: result,
  });
});

const getById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ShopService.getById(id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Shop retrieved successfully",
    data: result,
  });
});

const softDelete = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = (req as any).user;
  const result = await ShopService.softDelete(user, id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Shop deleted successfully",
    data: null,
  });
});

const deleteShop = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ShopService.deleteShop(id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Shop deleted successfully",
    data: result,
  });
});

export const ShopController = {
  createShop,
  getAllShop,
  getById,
  softDelete,
  deleteShop,
};
