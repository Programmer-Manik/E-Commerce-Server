"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartRouter = void 0;
const express_1 = __importDefault(require("express"));
const cart_controller_1 = require("./cart.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.get("/", (0, auth_1.default)(client_1.UserRole.customer, client_1.UserRole.admin, client_1.UserRole.vendor), cart_controller_1.CartController.getSingleCart);
router.post("/", (0, auth_1.default)(client_1.UserRole.customer, client_1.UserRole.admin, client_1.UserRole.vendor), cart_controller_1.CartController.createCart);
router.post("/reduce-quantity", (0, auth_1.default)(client_1.UserRole.customer, client_1.UserRole.admin, client_1.UserRole.vendor), cart_controller_1.CartController.reduceCartItemQuantity);
router.delete("/:id", cart_controller_1.CartController.deleteCartItem);
router.get("/check-same-vendor", (0, auth_1.default)(client_1.UserRole.customer, client_1.UserRole.admin, client_1.UserRole.vendor), cart_controller_1.CartController.checkSameVendorProduct);
router.delete("/", cart_controller_1.CartController.deleteAllCartAndItem);
exports.CartRouter = router;
