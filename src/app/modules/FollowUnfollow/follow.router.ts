import express from "express";
import { FollowerController } from "./follow.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/follow/:id",
  auth(UserRole.admin, UserRole.customer, UserRole.vendor),
  FollowerController.createFollow
);

router.delete(
  "/unfollow/:id",
  auth(UserRole.admin, UserRole.customer, UserRole.vendor),
  FollowerController.createUnfollow
);

router.get("/follow-count/:id", FollowerController.shopFollowCount);

router.get(
  "/check-my-follow/:id",
  auth(UserRole.admin, UserRole.customer, UserRole.vendor),
  FollowerController.checkMyFollow
);

export const FollowerRoutes = router;
