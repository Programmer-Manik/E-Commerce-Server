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
exports.UserService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwtHelpers_1 = require("../../../helpars/jwtHelpers");
const configs_1 = __importDefault(require("../../../configs"));
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassord = yield bcrypt_1.default.hash(payload.password, 12);
    payload.password = hashedPassord;
    if ((payload === null || payload === void 0 ? void 0 : payload.role) && (payload === null || payload === void 0 ? void 0 : payload.role) == "admin") {
        payload.role = "customer";
    }
    const result = yield prisma_1.default.user.create({
        data: payload,
    });
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken({ email: payload.email, role: payload.role }, configs_1.default.jwt.jwt_secret, configs_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.generateToken({ email: payload.email, role: payload.role }, configs_1.default.jwt.refresh_token_secret, configs_1.default.jwt.refresh_token_expires_in);
    return { result, accessToken, refreshToken };
});
const createAdmin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassord = yield bcrypt_1.default.hash(payload.password, 12);
    payload.password = hashedPassord;
    payload.role = "admin";
    const result = yield prisma_1.default.user.create({
        data: payload,
    });
    return result;
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findMany({
        where: {
            status: { notIn: [client_1.UserStatus.deleted] },
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            contactNumber: true,
            address: true,
            profilePhoto: true,
            status: true,
        },
        orderBy: {
            cretedAt: "desc",
        },
    });
    return result;
});
const getSingleUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.active,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            contactNumber: true,
            address: true,
            profilePhoto: true,
            status: true,
            shop: true,
        },
    });
    return result;
});
const updateSingleUser = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const result = yield prisma_1.default.user.update({
        where: {
            id,
        },
        data: payload,
    });
    if (result.role == "vendor" && result.status == "deleted") {
        const findShop = yield prisma_1.default.shop.findUnique({
            where: {
                userId: id,
            },
        });
        if (findShop) {
            const res = yield prisma_1.default.shop.update({
                where: {
                    userId: id,
                },
                data: {
                    isDeleted: true,
                },
            });
        }
    }
    return result;
});
const softDeleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const result = yield prisma_1.default.user.update({
        where: {
            id,
        },
        data: {
            status: client_1.UserStatus.deleted,
        },
    });
    if (userData.role == "vendor") {
        try {
            const shopData = yield prisma_1.default.shop.findUnique({
                where: {
                    userId: id,
                },
            });
            if (shopData === null || shopData === void 0 ? void 0 : shopData.id) {
                const deleteAllProduct = yield prisma_1.default.product.updateMany({
                    where: {
                        shopId: shopData === null || shopData === void 0 ? void 0 : shopData.id,
                    },
                    data: {
                        isDeleted: true,
                    },
                });
            }
            const deleteOrder = yield prisma_1.default.followUnfollow.deleteMany({
                where: {
                    shopId: shopData === null || shopData === void 0 ? void 0 : shopData.id,
                },
            });
            const deleteOrderProduct = yield prisma_1.default.cartItem.deleteMany({
                where: {
                    userEmail: userData === null || userData === void 0 ? void 0 : userData.email,
                },
            });
            const deleteShop = yield prisma_1.default.shop.delete({
                where: {
                    id: shopData === null || shopData === void 0 ? void 0 : shopData.id,
                },
            });
        }
        catch (err) {
            console.log(err);
        }
    }
    return result;
});
const blockedUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const result = yield prisma_1.default.user.update({
        where: {
            id,
        },
        data: {
            status: client_1.UserStatus.blocked,
        },
    });
    if (userData.role == "vendor") {
        try {
            const shopData = yield prisma_1.default.shop.findUnique({
                where: {
                    userId: id,
                },
            });
            if (shopData === null || shopData === void 0 ? void 0 : shopData.id) {
                const deleteAllProduct = yield prisma_1.default.product.updateMany({
                    where: {
                        shopId: shopData === null || shopData === void 0 ? void 0 : shopData.id,
                    },
                    data: {
                        isDeleted: true,
                    },
                });
            }
            const deleteOrderProduct = yield prisma_1.default.cartItem.deleteMany({
                where: {
                    userEmail: userData === null || userData === void 0 ? void 0 : userData.email,
                },
            });
            const deleteShop = yield prisma_1.default.shop.update({
                where: {
                    id: shopData === null || shopData === void 0 ? void 0 : shopData.id,
                },
                data: {
                    isDeleted: true,
                },
            });
        }
        catch (err) {
            console.log(err);
        }
    }
    return result;
});
const unblockedUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const result = yield prisma_1.default.user.update({
        where: {
            id,
        },
        data: {
            status: client_1.UserStatus.active,
        },
    });
    if (userData.role == "vendor") {
        try {
            const shopData = yield prisma_1.default.shop.findUnique({
                where: {
                    userId: id,
                },
            });
            if (shopData === null || shopData === void 0 ? void 0 : shopData.id) {
                const deleteAllProduct = yield prisma_1.default.product.updateMany({
                    where: {
                        shopId: shopData === null || shopData === void 0 ? void 0 : shopData.id,
                    },
                    data: {
                        isDeleted: false,
                    },
                });
            }
            const deleteShop = yield prisma_1.default.shop.update({
                where: {
                    id: shopData === null || shopData === void 0 ? void 0 : shopData.id,
                },
                data: {
                    isDeleted: false,
                },
            });
        }
        catch (err) {
            console.log(err);
        }
    }
    return result;
});
exports.UserService = {
    createUser,
    createAdmin,
    getAllUsers,
    getSingleUser,
    updateSingleUser,
    softDeleteUser,
    blockedUser,
    unblockedUser
};
