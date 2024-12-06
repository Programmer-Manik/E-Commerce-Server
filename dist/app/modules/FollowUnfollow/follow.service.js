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
exports.FollowerService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createFollow = (user, shopId) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.active,
        },
    });
    const shopData = yield prisma_1.default.shop.findUniqueOrThrow({
        where: {
            id: shopId,
            isDeleted: false,
        },
    });
    const result = yield prisma_1.default.followUnfollow.create({
        data: {
            folowerEmail: userData.id,
            shopId: shopData.id,
        },
    });
    return result;
});
const createUnfollow = (user, shopId) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.active,
        },
    });
    const shopData = yield prisma_1.default.shop.findUniqueOrThrow({
        where: {
            id: shopId,
            isDeleted: false,
        },
    });
    const result = yield prisma_1.default.followUnfollow.delete({
        where: {
            shopId_folowerEmail: {
                folowerEmail: userData.id,
                shopId: shopData.id,
            },
        },
    });
    return result;
});
const shopFollowCount = (shopId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.followUnfollow.count({
        where: {
            shopId: shopId,
        },
    });
    return result;
});
const checkMyFollow = (user, shopId) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.active,
        },
    });
    const result = yield prisma_1.default.followUnfollow.findUnique({
        where: {
            shopId_folowerEmail: {
                folowerEmail: userData.id,
                shopId: shopId,
            },
        },
    });
    if (result) {
        return true;
    }
    else {
        return false;
    }
});
exports.FollowerService = {
    createFollow,
    createUnfollow,
    shopFollowCount,
    checkMyFollow,
};
