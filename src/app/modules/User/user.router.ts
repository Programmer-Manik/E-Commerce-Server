import express from "express";
import { UserController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/", UserController.createUser);

router.post("/create-admin", auth(UserRole.admin), UserController.createAdmin);
router.get("/", auth(UserRole.admin), UserController.getAllUsers);
router.get(
  "/me",
  auth(UserRole.vendor, UserRole.admin, UserRole.customer),
  UserController.getSingleUser
);

export const UserRouter = router;
