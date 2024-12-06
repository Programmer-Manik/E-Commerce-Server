"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopRoutes = void 0;
const express_1 = __importDefault(require("express"));
const shop_contoller_1 = require("./shop.contoller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(client_1.UserRole.vendor), shop_contoller_1.ShopController.createShop);
router.get("/", (0, auth_1.default)(client_1.UserRole.admin), shop_contoller_1.ShopController.getAllShop);
router.get("/:id", shop_contoller_1.ShopController.getById);
router.delete("/soft/:id", (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.vendor), shop_contoller_1.ShopController.softDelete);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.admin), shop_contoller_1.ShopController.deleteShop);
router.patch("/", (0, auth_1.default)(client_1.UserRole.vendor), shop_contoller_1.ShopController.updateShop);
exports.ShopRoutes = router;
