import express from "express";
import { CartController } from "./cart.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.customer, UserRole.admin, UserRole.vendor),
  CartController.getSingleCart
);

router.post(
  "/",
  auth(UserRole.customer, UserRole.admin, UserRole.vendor),
  CartController.createCart
);

router.post(
  "/reduce-quantity",
  auth(UserRole.customer, UserRole.admin, UserRole.vendor),
  CartController.reduceCartItemQuantity
);

router.delete("/:id", CartController.deleteCartItem);

router.get(
  "/check-same-vendor",
  auth(UserRole.customer, UserRole.admin, UserRole.vendor),
  CartController.checkSameVendorProduct
);

router.delete("/", CartController.deleteAllCartAndItem);

export const CartRouter = router;
