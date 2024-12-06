"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponRouter = void 0;
const express_1 = __importDefault(require("express"));
const coupon_conrtoller_1 = require("./coupon.conrtoller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(client_1.UserRole.vendor), coupon_conrtoller_1.CouponController.createCoupon);
router.get("/", (0, auth_1.default)(client_1.UserRole.vendor), coupon_conrtoller_1.CouponController.getVendorCoupon);
router.post("/:couponCode", (0, auth_1.default)(client_1.UserRole.vendor, client_1.UserRole.customer, client_1.UserRole.admin), coupon_conrtoller_1.CouponController.getSingleCoupon);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.vendor), coupon_conrtoller_1.CouponController.deleteCoupon);
exports.CouponRouter = router;
