import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { CouponService } from "./coupon.service";

const createCoupon = catchAsync(async (req, res) => {
  const user = (req as any).user;
  const result = await CouponService.createCoupon(user as any, req.body as any);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Coupon create successfully",
    data: result,
  });
});

const getVendorCoupon = catchAsync(async (req, res) => {
  const user = (req as any).user;
  const result = await CouponService.getVendorCoupon(user as any);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Coupon fetch successfully",
    data: result,
  });
});

const getSingleCoupon = catchAsync(async (req, res) => {
  const { couponCode } = req.params;
  const result = await CouponService.getSingleCoupon(couponCode as string, req.body as any);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Coupon fetch successfully",
    data: result,
  });
});

const deleteCoupon = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = (req as any).user;
  const result = await CouponService.deleteCoupon(user as any, id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Coupon deleted successfully",
    data: result,
  });
});

export const CouponController = {
  createCoupon,
  getVendorCoupon,
  getSingleCoupon,
  deleteCoupon,
};
