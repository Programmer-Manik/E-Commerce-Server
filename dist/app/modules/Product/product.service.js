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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const paginationHelper_1 = require("../../../helpars/paginationHelper");
const product_constant_1 = require("./product.constant");
const createProduct = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.active,
        },
    });
    const shopData = yield prisma_1.default.shop.findUniqueOrThrow({
        where: {
            userId: vendorData.id,
            isDeleted: false,
        },
    });
    const result = yield prisma_1.default.product.create({
        data: Object.assign(Object.assign({}, payload), { userId: vendorData.id, shopId: shopData.id }),
    });
    return result;
});
const getAllProduct = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    //   console.log(filterData); //* aikhane upore destracture korar karone, searchTerm bade onno gulu show korbe
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePaginatin(options);
    // console.log({ limit, page, sortBy, sortOrder });
    const andConditions = [];
    if (params.searchTerm) {
        andConditions.push({
            OR: product_constant_1.productSearchAbleFields.map((field) => ({
                [field]: {
                    contains: params === null || params === void 0 ? void 0 : params.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    //   console.log(Object.keys(filterData)); // aikhane key gulu array akare debe
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    andConditions.push({
        isDeleted: false,
    });
    //   console.dir(andConditions, {depth: 'indinity'})
    const whereContitions = andConditions.length > 0 ? { AND: andConditions } : {};
    //   console.log({whereContitions})
    const result = yield prisma_1.default.product.findMany({
        where: whereContitions,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder
            ? {
                [sortBy]: sortOrder,
            }
            : {
                cretedAt: "desc",
            },
    });
    return result;
});
const getMyProduct = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.active,
        },
    });
    const result = yield prisma_1.default.product.findMany({
        where: {
            userId: vendorData.id,
            isDeleted: false,
        },
        orderBy: {
            cretedAt: "desc",
        },
    });
    return result;
});
const getById = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.product.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            shop: true,
        },
    });
    try {
        if (userId) {
            const existingRecord = yield prisma_1.default.recentProductShow.findUnique({
                where: { userId },
            });
            let updatedProductIds = existingRecord
                ? existingRecord.productIds.filter((id) => id !== result.id)
                : [];
            updatedProductIds.push(result.id);
            updatedProductIds = updatedProductIds.slice(-10);
            yield prisma_1.default.recentProductShow.upsert({
                where: { userId },
                update: {
                    productIds: updatedProductIds,
                },
                create: {
                    userId,
                    productIds: updatedProductIds,
                },
            });
        }
    }
    catch (err) {
        console.log(err);
    }
    return result;
});
const softDelete = (user, id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(user, id);
    const vendorData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.active,
        },
    });
    if (user && user.role != "admin") {
        yield prisma_1.default.product.findUniqueOrThrow({
            where: {
                id,
                userId: vendorData.id,
            },
        });
    }
    const result = yield prisma_1.default.product.update({
        where: {
            id,
        },
        data: {
            isDeleted: true,
        },
    });
    return result;
});
const deleteProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.product.delete({
        where: {
            id,
        },
    });
    return result;
});
const updateProduct = (id, payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.active,
        },
    });
    yield prisma_1.default.product.findUniqueOrThrow({
        where: {
            id,
            userId: vendorData.id,
        },
    });
    const result = yield prisma_1.default.product.update({
        where: {
            id,
        },
        data: Object.assign({}, payload),
    });
    return result;
});
const getProductsByShopId = (shopId, limit) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.shop.findUniqueOrThrow({
        where: {
            id: shopId,
            isDeleted: false,
        },
    });
    const result = yield prisma_1.default.product.findMany({
        where: {
            shopId,
            isDeleted: false,
        },
        take: limit || 10,
        orderBy: {
            cretedAt: "desc",
        },
    });
    return result;
});
exports.ProductService = {
    createProduct,
    getAllProduct,
    getById,
    softDelete,
    deleteProduct,
    getMyProduct,
    updateProduct,
    getProductsByShopId,
};
