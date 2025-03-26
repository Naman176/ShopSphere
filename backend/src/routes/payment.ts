import express from "express";
import {
  applyCoupon,
  createNewCoupon,
  createPaymentIntent,
  deleteCoupon,
  getAllCoupons,
} from "../controllers/payment.js";
import { isAdmin } from "../middlewares/auth.js";

const paymentRouter = express.Router();

paymentRouter.post("/create", createPaymentIntent);
paymentRouter.post("/coupon/new", isAdmin, createNewCoupon);
paymentRouter.get("/coupon/apply", applyCoupon);
paymentRouter.get("/coupon/all", isAdmin, getAllCoupons);
paymentRouter.delete("/coupon/:id", isAdmin, deleteCoupon);

export default paymentRouter;
