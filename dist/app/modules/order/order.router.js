"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRouter = void 0;
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("./order.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.customer, client_1.UserRole.vendor), order_controller_1.OrderController.createOrder);
router.get("/", (0, auth_1.default)(client_1.UserRole.admin), order_controller_1.OrderController.getAllOrder);
router.get("/for-customer", (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.customer, client_1.UserRole.vendor), order_controller_1.OrderController.getOrderForCustomer);
router.get("/for-vendor", (0, auth_1.default)(client_1.UserRole.vendor), order_controller_1.OrderController.getOrderForVendor);
exports.OrderRouter = router;
