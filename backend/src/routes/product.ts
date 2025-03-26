import express from "express";
import { isAdmin } from "../middlewares/auth.js";
import {
  createNewProduct,
  deleteProduct,
  getAllCategories,
  getAllProducts,
  getLatestProducts,
  getProductDetails,
  searchAndFilterProducts,
  updateProduct,
} from "../controllers/product.js";
import { singleUpload } from "../middlewares/multer.js";

const productRouter = express.Router();

productRouter.post("/new", isAdmin, singleUpload, createNewProduct);
productRouter.get("/latest", getLatestProducts);
productRouter.get("/category", getAllCategories);
productRouter.get("/all", isAdmin, getAllProducts);
productRouter.get("/search", searchAndFilterProducts);
productRouter
  .route("/:id")
  .get(getProductDetails)
  .put(isAdmin, singleUpload, updateProduct)
  .delete(isAdmin, deleteProduct);

export default productRouter;
