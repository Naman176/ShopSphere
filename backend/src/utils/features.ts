import mongoose from "mongoose";
import { InvalidateCacheProps } from "../types/types.js";
import { Product } from "../models/product.js";
import { myCache } from "../app.js";

export const connectDB = () => {
  mongoose
    .connect("mongodb://localhost:27017", {
      dbName: "ShopSphere",
    })
    .then((c) => console.log(`DB Connected to ${c.connection.host}`))
    .catch((e) => console.log(e));
};

export const invalidateCache = async ({ product }: InvalidateCacheProps) => {
  if (product) {
    const productKeys: string[] = [
      "latest-products",
      "categories",
      "all-products",
    ];

    const productIds = await Product.find({}).select("_id");

    productIds.forEach((i) => {
      productKeys.push(`product-${i._id}`);
    });

    myCache.del(productKeys);
  }
};
