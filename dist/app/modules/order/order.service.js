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
exports.OrderService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const payment_utils_1 = require("../payment/payment.utils");
const createOrder = (user, orderData) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, contactNumber, address, couponCode } = orderData;
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
        },
    });
    // cart information
    const cartInfo = yield prisma_1.default.cart.findUniqueOrThrow({
        where: {
            userId: userData.id,
        },
        include: {
            cartItem: true,
        },
    });
    const result = yield prisma_1.default.coupon.findUnique({
        where: {
            couponCode,
            vendorId: cartInfo.vendorId,
        },
    });
    let totalSum = cartInfo === null || cartInfo === void 0 ? void 0 : cartInfo.cartItem.reduce((sum, item) => sum + item.totalPrice, 0);
    if (result) {
        const discountPercent = result === null || result === void 0 ? void 0 : result.discount;
        const previousPrice = totalSum;
        totalSum = previousPrice - (previousPrice * discountPercent) / 100;
    }
    const createOrder = yield prisma_1.default.order.create({
        data: {
            user: {
                name: name || userData.name,
                email: userData.email,
                contactNumber: contactNumber || (userData === null || userData === void 0 ? void 0 : userData.contactNumber),
                address: address || (userData === null || userData === void 0 ? void 0 : userData.address),
            },
            totalPrice: totalSum,
            productInfo: cartInfo,
        },
    });
    const paymentData = {
        transactionId: createOrder.transactionId,
        totalPrice: createOrder.totalPrice,
        customerName: name || userData.name,
        customerEmail: userData.email,
        customerPhone: contactNumber || (userData === null || userData === void 0 ? void 0 : userData.contactNumber),
        customerAddress: address || (userData === null || userData === void 0 ? void 0 : userData.address),
    };
    //Payment
    const paymentSession = yield (0, payment_utils_1.initiatePayment)(paymentData);
    return paymentSession;
});
const getAllOrder = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.order.findMany();
    return result;
});
const getOrderForCustomer = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.order.findMany({
        where: {
            user: {
                path: ["email"],
                equals: user.email,
            },
        },
    });
    return result;
});
const getOrderForVendor = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
        },
    });
    const orders = yield prisma_1.default.order.findMany();
    const result = orders.filter((order) => {
        const productInfo = order.productInfo;
        return productInfo.vendorId === vendorData.id;
    });
    return result;
});
exports.OrderService = {
    createOrder,
    getAllOrder,
    getOrderForCustomer,
    getOrderForVendor,
};
