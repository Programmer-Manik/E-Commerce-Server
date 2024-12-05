import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import { ProductService } from "../Product/product.service";
import sendResponse from "../../../shared/sendResponse";
import { CartService } from "./cart.service";

const getSingleCart = catchAsync(async (req, res) => {
  const user = (req as any).user;
  const result = await CartService.getSingleCart(user as any);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Cart fetch successfully",
    data: result,
  });
});

const createCart = catchAsync(async (req, res) => {
  const user = (req as any).user;
  const result = await CartService.createCart(user as any, req.body as any);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Add to cart successfully",
    data: result,
  });
});

const deleteCartItem = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CartService.deleteCartItem(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Remove cart item successfully",
    data: result,
  });
});

const reduceCartItemQuantity = catchAsync(async (req, res) => {
  const user = (req as any).user;
  const result = await CartService.reduceCartItemQuantity(
    user as any,
    req.body as any
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "reduce cart item quantity successfully",
    data: result,
  });
});

const checkSameVendorProduct = catchAsync(async (req, res) => {
  const user = (req as any).user;
  const result = await CartService.checkSameVendorProduct(
    user as any
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "check same vendor product or not",
    data: result,
  });
});

const deleteAllCartAndItem = catchAsync(async (req, res) => {
  const result = await CartService.deleteAllCartAndItem();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Delete all cart and item successfully",
    data: result,
  });
});

export const CartController = {
  getSingleCart,
  createCart,
  deleteCartItem,
  reduceCartItemQuantity,
  deleteAllCartAndItem,
  checkSameVendorProduct,
};
