import express from "express";
import { ProductController } from "./product.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/", auth(UserRole.vendor), ProductController.createProduct);

router.get("/", ProductController.getAllProduct);

router.get("/:id", ProductController.getById);

router.get("/shop-product/:shopId", ProductController.getProductsByShopId);

router.get("/vendor/myproduct", auth(UserRole.vendor), ProductController.getMyProduct);

router.delete(
  "/soft/:id",
  auth(UserRole.vendor, UserRole.admin),
  ProductController.softDelete
);

router.delete("/:id", auth(UserRole.admin), ProductController.deleteProduct);

router.patch("/:id", auth(UserRole.vendor), ProductController.updateProduct);


export const ProductRoutes = router;
