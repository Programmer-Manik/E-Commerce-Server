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
exports.PaymentService = void 0;
const path_1 = require("path");
const payment_utils_1 = require("./payment.utils");
const fs_1 = require("fs");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const confirmationService = (transactionId, status) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const verifyResponse = yield (0, payment_utils_1.verifyPayment)(transactionId);
    let message = "";
    let orderData;
    if (verifyResponse && verifyResponse.pay_status === "Successful") {
        orderData = yield prisma_1.default.order.findUniqueOrThrow({
            where: {
                transactionId,
            },
        });
        yield prisma_1.default.order.update({
            where: {
                transactionId,
            },
            data: {
                paymentStatus: "paid",
            },
        });
        message = "Successfully Paid";
    }
    else {
        message = "Payment Failed!";
    }
    // delete all cart item
    yield prisma_1.default.cartItem.deleteMany({
        where: {
            userEmail: (_a = orderData === null || orderData === void 0 ? void 0 : orderData.user) === null || _a === void 0 ? void 0 : _a.email,
        },
    });
    const filePath = (0, path_1.join)(__dirname, "../../../../src/public/index.html");
    let template = (0, fs_1.readFileSync)(filePath, "utf-8");
    template = template.replace("{{message}}", message);
    template = template.replace("{{message2}}", status);
    return template;
});
exports.PaymentService = {
    confirmationService,
};
