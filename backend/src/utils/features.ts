import mongoose from "mongoose";
import { InvalidateCacheProps, OrderItemType } from "../types/types.js";
import { Product } from "../models/product.js";
import { myCache } from "../app.js";
import { Order } from "../models/order.js";

export const connectDB = (uri: string) => {
  mongoose
    .connect(uri, {
      dbName: "ShopSphere",
    })
    .then((c) => console.log(`DB Connected to ${c.connection.host}`))
    .catch((e) => console.log(e));
};

export const invalidateCache = ({
  product,
  productId,
  order,
  admin,
  userId,
  orderId,
}: InvalidateCacheProps) => {
  if (product) {
    const productKeys: string[] = [
      "latest-products",
      "categories",
      "all-products",
    ];

    if (typeof productId === "string") {
      productKeys.push(`product-${productId}`);
    } else if (typeof productId === "object") {
      productId.forEach((i) => productKeys.push(`product-${i}`));
    }

    myCache.del(productKeys);
  }

  if (order) {
    const orderKeys: string[] = [
      "all-orders",
      `my-orders-${userId}`,
      `order-${orderId}`,
    ];

    myCache.del(orderKeys);
  }

  if (admin) {
    myCache.del([
      "admin-stats",
      "admin-bar-charts",
      "admin-pie-charts",
      "admin-line-charts",
    ]);
  }
};

export const reduceStock = async (orderItems: OrderItemType[]) => {
  for (let i = 0; i < orderItems.length; i++) {
    const order = orderItems[i];
    const product = await Product.findById(order.productId);
    if (!product) {
      throw new Error("Product not Found");
    }
    product.stock -= order.quantity;
    await product.save();
  }
};

export const calculateStatsPercentage = (
  currentMonth: number,
  lastMonth: number
): number => {
  if (lastMonth === 0) return currentMonth * 100;
  const percent = (currentMonth / lastMonth) * 100;
  return Number(percent.toFixed(0));
};
