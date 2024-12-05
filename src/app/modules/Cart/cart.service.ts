import { UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";

const getSingleCart = async (user: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.active,
    },
  });
  const result = await prisma.cart.findUnique({
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

  const totalSum = result?.cartItem.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );

  return { totalSum, data: result };
};

const createCart = async (user: any, payload: any) => {
  // Fetch the active user
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.active,
    },
  });

  const vendorData = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.vendorId,
      status: UserStatus.active,
    },
  });

  // Upsert the cart
  const cart = await prisma.cart.upsert({
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
    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });
    await prisma.cart.update({
      where: {
        userId: userData.id,
      },
      data: {
        vendorId: payload.vendorId,
      },
    });
  }

  // Fetch the product details
  const productData = await prisma.product.findUniqueOrThrow({
    where: {
      id: payload.productId,
      isDeleted: false,
    },
  });

  const totalPrice = payload.quantity * productData.price;

  // Check if the product already exists in the cart
  const existingCartItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId: payload.productId,
    },
  });

  let cartItem;

  if (existingCartItem) {
    // If the product exists in the cart, update the quantity and total price
    cartItem = await prisma.cartItem.update({
      where: {
        id: existingCartItem.id,
      },
      data: {
        quantity: existingCartItem.quantity + payload.quantity,
        totalPrice: existingCartItem.totalPrice + totalPrice,
      },
    });
  } else {
    // If the product does not exist in the cart, create a new CartItem
    cartItem = await prisma.cartItem.create({
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
};

const reduceCartItemQuantity = async (user: any, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const cartData = await prisma.cart.findUniqueOrThrow({
    where: {
      userId: userData.id,
    },
  });
  const productData = await prisma.product.findUniqueOrThrow({
    where: {
      id: payload.productId,
      isDeleted: false,
    },
  });

  const totalPrice = payload.quantity * productData.price;

  // Check if the product already exists in the cart
  const existingCartItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cartData.id,
      productId: payload.productId,
    },
  });
  let cartItem;

  if (existingCartItem && existingCartItem.quantity > payload.quantity) {
    // If the product exists in the cart, update the quantity and total price
    cartItem = await prisma.cartItem.update({
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
};

const deleteCartItem = async (cartItemId: string) => {
  const result = await prisma.cartItem.delete({
    where: {
      id: cartItemId,
    },
  });
  return result;
};

const checkSameVendorProduct = async (user: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const checkSameVendorProduct = await prisma.cart.findUnique({
    where: {
      userId: userData.id,
    },
  });

  return checkSameVendorProduct

};

const deleteAllCartAndItem = async () => {
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
};

export const CartService = {
  getSingleCart,
  createCart,
  deleteCartItem,
  reduceCartItemQuantity,
  deleteAllCartAndItem,
  checkSameVendorProduct,
};
