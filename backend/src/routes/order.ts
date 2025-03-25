import express from "express";
import {
  allOrders,
  createNewOrder,
  deleteOrder,
  getOrderDetails,
  myOrders,
  processOrder,
} from "../controllers/order.js";
import { isAdmin } from "../middlewares/auth.js";

const orderRouter = express.Router();

orderRouter.post("/new", createNewOrder);
orderRouter.get("/my", myOrders);
orderRouter.get("/all", isAdmin, allOrders);
orderRouter
  .route("/:id")
  .get(getOrderDetails)
  .put(isAdmin, processOrder)
  .delete(isAdmin, deleteOrder);

export default orderRouter;
