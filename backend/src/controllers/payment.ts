import { stripe } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js";
import { response_200, response_201 } from "../utils/responseCodes.js";
import ErrorHandler from "../utils/utility_class.js";

// @user
export const createPaymentIntent = TryCatch(async (req, res, next) => {
  const { amount } = req.body;

  if (!amount) {
    return next(new ErrorHandler("Amount is required", 400));
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Number(amount) * 100,
    currency: "inr",
  });

  response_201(
    res,
    true,
    "Payment Intent Created",
    paymentIntent.client_secret!
  );
  return;
});

// @admin
export const createNewCoupon = TryCatch(async (req, res, next) => {
  const { couponCode, amount } = req.body;

  if (!couponCode || !amount) {
    return next(
      new ErrorHandler("Both Coupon Code and Amount are required", 400)
    );
  }

  await Coupon.create({ couponCode, amount });

  response_201(res, true, `Coupon ${couponCode} Created`);
  return;
});

// @user
export const applyCoupon = TryCatch(async (req, res, next) => {
  const { couponCode } = req.query;

  const coupon = await Coupon.findOne({ couponCode });
  if (!coupon) {
    return next(new ErrorHandler("Invalid Coupon Code", 400));
  }

  response_200(res, true, `Coupon ${coupon.couponCode} Applied`, coupon.amount);
  return;
});

// @admin
export const getAllCoupons = TryCatch(async (req, res, next) => {
  const allCoupons = await Coupon.find();

  response_200(res, true, "All Coupons Fetched", allCoupons);
  return;
});

// @admin
export const deleteCoupon = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const coupon = await Coupon.findById(id);
  if (!coupon) {
    return next(new ErrorHandler("Invalid Coupon", 400));
  }

  await coupon.deleteOne();

  response_200(res, true, `Coupon ${coupon.couponCode} Deleted`, coupon);
  return;
});
