"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createCoupon = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.active,
        },
    });
    const result = yield prisma_1.default.coupon.create({
        data: {
            vendorId: userData.id,
            discount: payload.discount,
            couponCode: payload.couponCode,
        },
    });
    return result;
});
const getVendorCoupon = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.active,
        },
    });
    const result = yield prisma_1.default.coupon.findMany({
        where: {
            vendorId: userData.id,
        },
    });
    return result;
});
const getSingleCoupon = (couponCode, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.coupon.findUniqueOrThrow({
        where: {
            couponCode,
            vendorId: payload.vendorId,
        },
    });
    return result;
});
const deleteCoupon = (usre, id) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: usre.email,
            status: client_1.UserStatus.active,
        },
    });
    const result = yield prisma_1.default.coupon.delete({
        where: {
            id,
            vendorId: userData.id,
        },
    });
    return result;
});
exports.CouponService = {
    createCoupon,
    getVendorCoupon,
    getSingleCoupon,
    deleteCoupon,
};
