import express from "express";
import { OrderController } from "./order.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.admin, UserRole.customer, UserRole.vendor),
  OrderController.createOrder
);

router.get("/", auth(UserRole.admin), OrderController.getAllOrder);

router.get(
  "/for-customer",
  auth(UserRole.admin, UserRole.customer, UserRole.vendor),
  OrderController.getOrderForCustomer
);

router.get(
  "/for-vendor",
  auth(UserRole.vendor),
  OrderController.getOrderForVendor
);

export const OrderRouter = router;
