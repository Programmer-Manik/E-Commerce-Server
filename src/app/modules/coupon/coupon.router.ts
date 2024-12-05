import express from "express";
import { CouponController } from "./coupon.conrtoller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/", auth(UserRole.vendor), CouponController.createCoupon);

router.get("/", auth(UserRole.vendor), CouponController.getVendorCoupon);

router.post(
  "/:couponCode",
  auth(UserRole.vendor, UserRole.customer, UserRole.admin),
  CouponController.getSingleCoupon
);

router.delete("/:id", auth(UserRole.vendor), CouponController.deleteCoupon);

export const CouponRouter = router;
