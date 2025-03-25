import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error.js";
import {
  NewProductRequestBody,
  ProductSearchRequestQuery,
  SearchBaseQuery,
} from "../types/types.js";
import { Product } from "../models/product.js";
import { response_200, response_201 } from "../utils/responseCodes.js";
import ErrorHandler from "../utils/utility_class.js";
import { rm } from "fs";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";

// @admin
export const createNewProduct = TryCatch(
  async (
    req: Request<{}, {}, NewProductRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, category, price, stock } = req.body;
    const photo = req.file;

    if (!photo) {
      return next(new ErrorHandler("Please add Photo", 400));
    }

    if (!name || !category || !stock || !price) {
      rm(photo.path, () => {
        console.log("Product Photo Deleted");
      });
      return next(new ErrorHandler("Please enter all Fields", 400));
    }

    await Product.create({
      name,
      category: category.toLowerCase(),
      price,
      stock,
      photo: photo.path,
    });

    // Invalidating Cache
    await invalidateCache({ product: true });

    response_201(res, true, "Product Created");
    return;
  }
);

// @user
// *************** Revalidate cache on create, update, delete product and on New Order *****************
export const getLatestProducts = TryCatch(async (req, res, next) => {
  let latestProducts;

  // Checking if cache have latest products
  if (myCache.has("latest-products")) {
    // If yes then don't need to make a call to DB
    latestProducts = JSON.parse(myCache.get("latest-products") as string);
  } else {
    // If not then bringing data from DB
    latestProducts = await Product.find({}).sort({ createdAt: -1 }).limit(10);

    // Storing latest products in cache
    myCache.set("latest-products", JSON.stringify(latestProducts));
  }

  response_200(res, true, "Latest products Fetched", latestProducts);
  return;
});

// @user
// *************** Revalidate cache on create, update, delete product and on New Order *****************
export const getAllCategories = TryCatch(async (req, res, next) => {
  let categories;

  // Checking if cache have categories
  if (myCache.has("categories")) {
    // If yes then don't need to make a call to DB
    categories = JSON.parse(myCache.get("categories") as string);
  } else {
    // If not then bringing data from DB
    categories = await Product.distinct("category");

    // Storing categories in cache
    myCache.set("categories", JSON.stringify(categories));
  }

  response_200(res, true, "All categories Fetched", categories);
  return;
});

// @user
// *************** Revalidate cache on create, update, delete product and on New Order *****************
export const getAllProducts = TryCatch(async (req, res, next) => {
  let allProducts;

  // Checking if cache have all products
  if (myCache.has("all-products")) {
    // If yes then don't need to make a call to DB
    allProducts = JSON.parse(myCache.get("all-products") as string);
  } else {
    // If not then bringing data from DB
    allProducts = await Product.find({});

    // Storing all products in cache
    myCache.set("all-products", JSON.stringify(allProducts));
  }

  response_200(res, true, "All products Fetched", allProducts);
  return;
});

// @user
// *************** Revalidate cache on create, update, delete product and on New Order *****************
export const getProductDetails = TryCatch(async (req, res, next) => {
  let product;

  const { id } = req.params;

  // Checking if cache have product details
  if (myCache.has(`product-${id}`)) {
    // If yes then don't need to make a call to DB
    product = JSON.parse(myCache.get(`product-${id}`) as string);
  } else {
    // If not then bringing data from DB
    product = await Product.findById(id);

    if (!product) {
      return next(new ErrorHandler("Product not Found", 404));
    }

    // Storing product details in cache
    myCache.set(`product-${id}`, JSON.stringify(product));
  }

  response_200(res, true, "Product details Fetched", product);
  return;
});

// @admin
export const updateProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { name, category, price, stock } = req.body;
  const photo = req.file;

  const product = await Product.findById(id);

  if (!product) {
    return next(new ErrorHandler("Product not Found", 404));
  }

  if (photo) {
    rm(product.photo, () => {
      console.log("Old Product Photo Deleted");
    });
    product.photo = photo.path;
  }

  if (name) product.name = name;
  if (category) product.category = category;
  if (price) product.price = price;
  if (stock) product.stock = stock;

  product.save();

  // Invalidating Cache
  await invalidateCache({ product: true, productId: String(product._id) });

  response_200(res, true, "Product Updated", product);
  return;
});

// @admin
export const deleteProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    return next(new ErrorHandler("Product not Found", 404));
  }

  rm(product.photo, () => {
    console.log("Product Photo Deleted");
  });

  await product.deleteOne();

  // Invalidating Cache
  await invalidateCache({ product: true, productId: String(product._id) });

  response_200(res, true, "Product Deleted", product);
  return;
});

// @user
export const searchAndFilterProducts = TryCatch(
  async (req: Request<{}, {}, {}, ProductSearchRequestQuery>, res, next) => {
    const { search, sort, category, price } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 10;
    const skip = (page - 1) * limit;

    const baseQuery: SearchBaseQuery = {};
    if (search) {
      baseQuery.name = {
        $regex: search,
        $options: "i",
      };
    }

    if (price) {
      baseQuery.price = {
        $lte: Number(price),
      };
    }

    if (category) {
      baseQuery.category = category;
    }

    // These two will run one after other which will take time, to make this fast we will run both queries in parallel
    // const searchedProducts = await Product.find(baseQuery)
    //   .sort(sort && { price: sort === "asc" ? 1 : -1 })
    //   .limit(limit)
    //   .skip(skip);

    // const allSearchedProducts = await Product.find(baseQuery);

    // Method to run both the above commented queries in parallel
    const [searchedProducts, allSearchedProducts] = await Promise.all([
      Product.find(baseQuery)
        .sort(sort && { price: sort === "asc" ? 1 : -1 })
        .limit(limit)
        .skip(skip),
      Product.find(baseQuery),
    ]);

    const totalPages = Math.ceil(allSearchedProducts.length / limit);

    response_200(res, true, "Products Fetched", searchedProducts, totalPages);
    return;
  }
);
