import express from "express";
import { AuthController } from "./auth.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/login", AuthController.loginUser);

router.post("/refresh-token", AuthController.refreshToken);

router.post(
  "/change-passwod",
  auth(UserRole.customer, UserRole.vendor, UserRole.admin),
  AuthController.changePassword
);

router.post("/forgot-password", AuthController.forgotPassword);

router.post("/reset-password/:token", AuthController.resetPassword);

export const AuthRoutes = router;
