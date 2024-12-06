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

router.patch("/:id", auth(UserRole.admin), UserController.updateSingleUser);

router.delete("/:id", auth(UserRole.admin), UserController.softDeleteUser);
router.patch("/block/:id", auth(UserRole.admin), UserController.blockedUser);
router.patch(
  "/unblock/:id",
  auth(UserRole.admin),
  UserController.unblockedUser
);

export const UserRouter = router;
