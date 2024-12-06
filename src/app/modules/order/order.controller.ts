import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { OrderService } from "./order.service";

const createOrder = catchAsync(async (req, res) => {
  const user = (req as any).user;
  const result = await OrderService.createOrder(user as any, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Order create successfully",
    data: result,
  });
});

const getAllOrder = catchAsync(async (req, res) => {
  const result = await OrderService.getAllOrder();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Order fetch successfully",
    data: result,
  });
});

const getOrderForCustomer = catchAsync(async (req, res) => {
  const user = (req as any).user;
  const result = await OrderService.getOrderForCustomer(user as any);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Order fetch successfully",
    data: result,
  });
});

const getOrderForVendor = catchAsync(async (req, res) => {
  const user = (req as any).user;
  const result = await OrderService.getOrderForVendor(user as any);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Order fetch successfully",
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getAllOrder,
  getOrderForCustomer,
  getOrderForVendor,
};
