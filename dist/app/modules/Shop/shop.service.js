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
exports.ShopService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createShop = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            role: client_1.UserRole.vendor,
            status: client_1.UserStatus.active,
        },
    });
    const result = yield prisma_1.default.shop.create({
        data: Object.assign(Object.assign({}, payload), { userId: vendorData.id }),
    });
    return result;
});
const getAllShop = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.shop.findMany({
        where: {
            isDeleted: false,
        },
        //    select: {
        //     id: true,
        //     name: true,
        //     title: true,
        //     userId: true,
        //     logo: true,
        //     followers: true,
        //    }
    });
    return result;
});
const getById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    result = yield prisma_1.default.shop.findUnique({
        where: {
            id,
            isDeleted: false,
        },
    });
    if (!result) {
        result = yield prisma_1.default.shop.findFirstOrThrow({
            where: {
                userId: id,
                isDeleted: false,
            },
        });
    }
    return result;
});
const softDelete = (user, id) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.active,
        },
    });
    if (user && user.role != "admin") {
        yield prisma_1.default.shop.findUniqueOrThrow({
            where: {
                id,
                userId: vendorData.id,
            },
        });
    }
    const result = yield prisma_1.default.shop.update({
        where: {
            id,
        },
        data: {
            isDeleted: true,
        },
    });
    return result;
});
const deleteShop = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.shop.delete({
        where: {
            id,
        },
    });
    return result;
});
const updateShop = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.active,
        },
    });
    const shopInfo = yield prisma_1.default.shop.findUniqueOrThrow({
        where: {
            userId: vendorData.id,
            isDeleted: false,
        },
    });
    const result = yield prisma_1.default.shop.update({
        where: {
            id: shopInfo.id,
        },
        data: Object.assign({}, payload),
    });
    return result;
});
exports.ShopService = {
    createShop,
    getAllShop,
    getById,
    softDelete,
    deleteShop,
    updateShop,
};
