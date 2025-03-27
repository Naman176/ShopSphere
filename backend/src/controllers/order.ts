import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewOrderRequestBody } from "../types/types.js";
import { Order } from "../models/order.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import { response_200, response_201 } from "../utils/responseCodes.js";
import ErrorHandler from "../utils/utility_class.js";
import { myCache } from "../app.js";

// @user
export const createNewOrder = TryCatch(
  async (req: Request<{}, {}, NewOrderRequestBody>, res, next) => {
    const {
      shippingInfo,
      user,
      subTotal,
      tax,
      shippingCharges,
      discount,
      total,
      orderItems,
    } = req.body;

    if (!shippingInfo || !user || !subTotal || !tax || !total || !orderItems) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    const order = await Order.create({
      shippingInfo,
      user,
      subTotal,
      tax,
      shippingCharges,
      discount,
      total,
      orderItems,
    });

    await reduceStock(orderItems);

    invalidateCache({
      product: true,
      productId: orderItems.map((i) => String(i.productId)),
      order: true,
      admin: true,
      userId: user,
    });

    response_201(res, true, "Order Placed", { order });
    return;
  }
);

// @user
export const myOrders = TryCatch(async (req, res, next) => {
  const user = req.query.id;

  const key = `my-orders-${user}`;

  let orders;

  if (myCache.has(key)) {
    orders = JSON.parse(myCache.get(key) as string);
  } else {
    orders = await Order.find({ user });
    myCache.set(key, JSON.stringify(orders));
  }

  response_200(res, true, "My orders Fetched", { orders });
  return;
});

// @admin
export const allOrders = TryCatch(async (req, res, next) => {
  const key = "all-orders";

  let orders;

  if (myCache.has(key)) {
    orders = JSON.parse(myCache.get(key) as string);
  } else {
    orders = await Order.find().populate("user", "name");
    myCache.set(key, JSON.stringify(orders));
  }

  response_200(res, true, "All orders Fetched", { orders });
  return;
});

// @user
export const getOrderDetails = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const key = `order-${id}`;

  let order;

  if (myCache.has(key)) {
    order = JSON.parse(myCache.get(key) as string);
  } else {
    order = await Order.findById(id).populate("user", "name");

    if (!order) {
      return next(new ErrorHandler("Order not Found", 404));
    }

    myCache.set(key, JSON.stringify(order));
  }

  response_200(res, true, "Order details Fetched", { order });
  return;
});

// @admin
export const processOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) {
    return next(new ErrorHandler("Order not Found", 404));
  }

  if (order.status === "Processing") {
    order.status = "Shipped";
  } else if (order.status === "Shipped") {
    order.status = "Delivered";
  } else {
    order.status = "Delivered";
  }

  await order.save();

  invalidateCache({
    product: false,
    order: true,
    admin: true,
    userId: order.user,
    orderId: String(order._id),
  });

  response_200(res, true, "Order Processed", { order });
  return;
});

// @admin
export const deleteOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) {
    return next(new ErrorHandler("Order not Found", 404));
  }

  await order.deleteOne();

  invalidateCache({
    product: false,
    order: true,
    admin: true,
    userId: order.user,
    orderId: String(order._id),
  });

  response_200(res, true, "Order Deleted", { order });
  return;
});
