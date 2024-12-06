import express from "express";
import { CategoryController } from "./category.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/", auth(UserRole.admin), CategoryController.createCategory);
router.get("/", CategoryController.getAllCategory);
router.patch("/:id", auth(UserRole.admin), CategoryController.updateCategory);
router.delete("/:id", auth(UserRole.admin), CategoryController.deleteCategory);

export const CategoryRoutes = router;
