import express from "express";
import { ShopService } from "./shop.service";
import { ShopController } from "./shop.contoller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/", auth(UserRole.vendor), ShopController.createShop);

router.get("/", auth(UserRole.admin), ShopController.getAllShop);

router.get("/:id", ShopController.getById);

router.delete(
  "/soft/:id",
  auth(UserRole.admin, UserRole.vendor),
  ShopController.softDelete
);

router.delete("/:id", auth(UserRole.admin), ShopController.deleteShop);

router.patch("/", auth(UserRole.vendor), ShopController.updateShop);

export const ShopRoutes = router;
