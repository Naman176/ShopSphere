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

    response_201(res, true, "Product created Successfully");
    return;
  }
);

// @user
export const getLatestProducts = TryCatch(async (req, res, next) => {
  const latestProducts = await Product.find({})
    .sort({ createdAt: -1 })
    .limit(10);

  response_200(
    res,
    true,
    "Latest products fetched Successfully",
    latestProducts
  );
  return;
});

// @user
export const getAllCategories = TryCatch(async (req, res, next) => {
  const categories = await Product.distinct("category");

  response_200(res, true, "All categories fetched Successfully", categories);
  return;
});

// @user
export const getAllProducts = TryCatch(async (req, res, next) => {
  const allProducts = await Product.find({});

  response_200(res, true, "All products fetched Successfully", allProducts);
  return;
});

// @user
export const getProductDetails = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    return next(new ErrorHandler("Product not Found", 404));
  }

  response_200(res, true, "Product details fetched Successfully", product);
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

  response_200(res, true, "Product updates Successfully", product);
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

    response_200(
      res,
      true,
      "Products fetched Successfully",
      searchedProducts,
      totalPages
    );
    return;
  }
);
