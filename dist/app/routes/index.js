"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_router_1 = require("../modules/User/user.router");
const auth_routes_1 = require("../modules/Auth/auth.routes");
const shop_router_1 = require("../modules/Shop/shop.router");
const product_router_1 = require("../modules/Product/product.router");
const follow_router_1 = require("../modules/FollowUnfollow/follow.router");
const recentPro_router_1 = require("../modules/RecentProduct/recentPro.router");
const cart_router_1 = require("../modules/Cart/cart.router");
const order_router_1 = require("../modules/order/order.router");
const payment_route_1 = require("../modules/payment/payment.route");
const coupon_router_1 = require("../modules/coupon/coupon.router");
const category_router_1 = require("../modules/Category/category.router");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/user",
        route: user_router_1.UserRouter,
    },
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: "/shop",
        route: shop_router_1.ShopRoutes,
    },
    {
        path: "/product",
        route: product_router_1.ProductRoutes,
    },
    {
        path: "/",
        route: follow_router_1.FollowerRoutes,
    },
    {
        path: "/recent-product-view",
        route: recentPro_router_1.RecentProductRoutes,
    },
    {
        path: "/cart",
        route: cart_router_1.CartRouter,
    },
    {
        path: "/order",
        route: order_router_1.OrderRouter,
    },
    {
        path: "/payment",
        route: payment_route_1.PaymentRoutes,
    },
    {
        path: "/coupon",
        route: coupon_router_1.CouponRouter,
    },
    {
        path: "/category",
        route: category_router_1.CategoryRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
