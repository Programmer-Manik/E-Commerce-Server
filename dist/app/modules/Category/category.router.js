"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("./category.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(client_1.UserRole.admin), category_controller_1.CategoryController.createCategory);
router.get("/", category_controller_1.CategoryController.getAllCategory);
router.patch("/:id", (0, auth_1.default)(client_1.UserRole.admin), category_controller_1.CategoryController.updateCategory);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.admin), category_controller_1.CategoryController.deleteCategory);
exports.CategoryRoutes = router;
