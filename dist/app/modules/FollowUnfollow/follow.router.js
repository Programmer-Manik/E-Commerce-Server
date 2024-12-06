"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowerRoutes = void 0;
const express_1 = __importDefault(require("express"));
const follow_controller_1 = require("./follow.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post("/follow/:id", (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.customer, client_1.UserRole.vendor), follow_controller_1.FollowerController.createFollow);
router.delete("/unfollow/:id", (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.customer, client_1.UserRole.vendor), follow_controller_1.FollowerController.createUnfollow);
router.get("/follow-count/:id", follow_controller_1.FollowerController.shopFollowCount);
router.get("/check-my-follow/:id", (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.customer, client_1.UserRole.vendor), follow_controller_1.FollowerController.checkMyFollow);
exports.FollowerRoutes = router;
