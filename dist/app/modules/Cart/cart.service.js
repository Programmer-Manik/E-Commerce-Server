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
exports.CartService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const getSingleCart = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.active,
        },
    });
    const result = yield prisma_1.default.cart.findUnique({
        where: {
            userId: userData.id,
        },
        include: {
            cartItem: {
                include: {
                    product: true,
                },
                orderBy: {
                    cretedAt: "desc",
                },
            },
        },
    });
    const totalSum = result === null || result === void 0 ? void 0 : result.cartItem.reduce((sum, item) => sum + item.totalPrice, 0);
    return { totalSum, data: result };
});
const createCart = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch the active user
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            status: client_1.UserStatus.active,
        },
    });
    const vendorData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: payload.vendorId,
            status: client_1.UserStatus.active,
        },
    });
    // Upsert the cart
    const cart = yield prisma_1.default.cart.upsert({
        where: {
            userId: userData.id,
        },
        update: {},
        create: {
            userId: userData.id,
            vendorId: vendorData.id,
        },
    });
    // const cardData = await prisma.cart.findUniqueOrThrow({
    //   where: {
    //     userId: userData.id,
    //   },
    // });
    if (cart.vendorId !== payload.vendorId) {
        yield prisma_1.default.cartItem.deleteMany({
            where: {
                cartId: cart.id,
            },
        });
        yield prisma_1.default.cart.update({
            where: {
                userId: userData.id,
            },
            data: {
                vendorId: payload.vendorId,
            },
        });
    }
    // Fetch the product details
    const productData = yield prisma_1.default.product.findUniqueOrThrow({
        where: {
            id: payload.productId,
            isDeleted: false,
        },
    });
    const totalPrice = payload.quantity * productData.price;
    // Check if the product already exists in the cart
    const existingCartItem = yield prisma_1.default.cartItem.findFirst({
        where: {
            cartId: cart.id,
            productId: payload.productId,
        },
    });
    let cartItem;
    if (existingCartItem) {
        // If the product exists in the cart, update the quantity and total price
        cartItem = yield prisma_1.default.cartItem.update({
            where: {
                id: existingCartItem.id,
            },
            data: {
                quantity: existingCartItem.quantity + payload.quantity,
                totalPrice: existingCartItem.totalPrice + totalPrice,
            },
        });
    }
    else {
        // If the product does not exist in the cart, create a new CartItem
        cartItem = yield prisma_1.default.cartItem.create({
            data: {
                cartId: cart.id,
                productId: payload.productId,
                quantity: payload.quantity,
                totalPrice,
                userEmail: userData.email,
            },
        });
    }
    return cartItem;
});
const reduceCartItemQuantity = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
        },
    });
    const cartData = yield prisma_1.default.cart.findUniqueOrThrow({
        where: {
            userId: userData.id,
        },
    });
    const productData = yield prisma_1.default.product.findUniqueOrThrow({
        where: {
            id: payload.productId,
            isDeleted: false,
        },
    });
    const totalPrice = payload.quantity * productData.price;
    // Check if the product already exists in the cart
    const existingCartItem = yield prisma_1.default.cartItem.findFirst({
        where: {
            cartId: cartData.id,
            productId: payload.productId,
        },
    });
    let cartItem;
    if (existingCartItem && existingCartItem.quantity > payload.quantity) {
        // If the product exists in the cart, update the quantity and total price
        cartItem = yield prisma_1.default.cartItem.update({
            where: {
                id: existingCartItem.id,
            },
            data: {
                quantity: existingCartItem.quantity - payload.quantity,
                totalPrice: existingCartItem.totalPrice - totalPrice,
            },
        });
    }
    return cartItem;
});
const deleteCartItem = (cartItemId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.cartItem.delete({
        where: {
            id: cartItemId,
        },
    });
    return result;
});
const checkSameVendorProduct = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
        },
    });
    const checkSameVendorProduct = yield prisma_1.default.cart.findUnique({
        where: {
            userId: userData.id,
        },
    });
    return checkSameVendorProduct;
});
const deleteAllCartAndItem = () => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.cartItem.deleteMany();
    yield prisma_1.default.cart.deleteMany();
});
exports.CartService = {
    getSingleCart,
    createCart,
    deleteCartItem,
    reduceCartItemQuantity,
    deleteAllCartAndItem,
    checkSameVendorProduct,
};
