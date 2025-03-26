import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { calculateStatsPercentage } from "../utils/features.js";
import { response_200 } from "../utils/responseCodes.js";

// @admin
export const getStatData = TryCatch(async (req, res, next) => {
  let stats;
  const key = "admin-stats";

  if (myCache.has(key)) {
    stats = JSON.parse(myCache.get(key) as string);
  } else {
    const today = new Date();
    const startOfCurrentMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );
    const startOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    const currentMonth = {
      start: startOfCurrentMonth,
      end: today,
    };
    const lastMonth = {
      start: startOfLastMonth,
      end: endOfLastMonth,
    };

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const currentMonthProductsPromise = Product.find({
      createdAt: {
        $gte: currentMonth.start,
        $lte: currentMonth.end,
      },
    });
    const lastMonthProductsPromise = Product.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    const currentMonthUsersPromise = User.find({
      createdAt: {
        $gte: currentMonth.start,
        $lte: currentMonth.end,
      },
    });
    const lastMonthUsersPromise = User.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    const currentMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: currentMonth.start,
        $lte: currentMonth.end,
      },
    });
    const lastMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    const lastSixMonthsOrdersPromise = Order.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    });

    const latestTransactionsPromise = Order.find({})
      .select(["orderItems", "discount", "total", "status"])
      .limit(4);

    const [
      currentMonthProducts,
      currentMonthUsers,
      currentMonthOrders,
      lastMonthProducts,
      lastMonthUsers,
      lastMonthOrders,
      productsCount,
      usersCount,
      allOrders,
      lastSixMonthsOrders,
      categories,
      femaleUsersCount,
      latestTransactions,
    ] = await Promise.all([
      currentMonthProductsPromise,
      currentMonthUsersPromise,
      currentMonthOrdersPromise,
      lastMonthProductsPromise,
      lastMonthUsersPromise,
      lastMonthOrdersPromise,
      Product.countDocuments(),
      User.countDocuments(),
      Order.find({}).select("total"),
      lastSixMonthsOrdersPromise,
      Product.distinct("category"),
      User.countDocuments({ gender: "female" }),
      latestTransactionsPromise,
    ]);

    const currentMonthRevenue = currentMonthOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const lastMonthRevenue = lastMonthOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const percentageChange = {
      revenue: calculateStatsPercentage(currentMonthRevenue, lastMonthRevenue),
      product: calculateStatsPercentage(
        currentMonthProducts.length,
        lastMonthProducts.length
      ),
      user: calculateStatsPercentage(
        currentMonthUsers.length,
        lastMonthUsers.length
      ),
      order: calculateStatsPercentage(
        currentMonthOrders.length,
        lastMonthOrders.length
      ),
    };

    const revenue = allOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const orderMonthCounts = new Array(6).fill(0);
    const orderMonthRevenue = new Array(6).fill(0);

    lastSixMonthsOrders.forEach((order) => {
      const creationDate = order.createdAt;
      const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

      if (monthDiff < 6) {
        orderMonthCounts[6 - 1 - monthDiff] += 1;
        orderMonthRevenue[6 - 1 - monthDiff] += order.total;
      }
    });

    const count = {
      revenue,
      user: usersCount,
      product: productsCount,
      order: allOrders.length,
    };

    const allCategoriesCountPromise = categories.map((category) =>
      Product.countDocuments({ category })
    );
    const categoriesCountOnly = await Promise.all(allCategoriesCountPromise);

    const categoryCount: Record<string, number>[] = [];
    categories.forEach((category, i) => {
      categoryCount.push({
        [category]: Math.round((categoriesCountOnly[i] / productsCount) * 100),
      });
    });

    const modifiedLatestTransaction = latestTransactions.map((i) => ({
      _id: i._id,
      discount: i.discount,
      amount: i.total,
      quantity: i.orderItems.length,
      status: i.status,
    }));

    stats = {
      categoryCount,
      percentageChange,
      count,
      chart: {
        order: orderMonthCounts,
        revenue: orderMonthRevenue,
      },
      userGenderratio: {
        male: usersCount - femaleUsersCount,
        female: femaleUsersCount,
      },
      modifiedLatestTransaction,
    };

    myCache.set(key, JSON.stringify(stats));
  }

  response_200(res, true, "Stats Data Fetched", stats);
  return;
});

// @admin
export const getBarData = TryCatch(async (req, res, next) => {
  let charts;
  const key = "admin-bar-charts";

  if (myCache.has(key)) {
    charts = JSON.parse(myCache.get(key) as string);
  } else {
    const today = new Date();

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const lastSixMonthsProductsPromise = Product.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");

    const lastSixMonthsUsersPromise = User.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");

    const lastTwelveMonthsOrdersPromise = Order.find({
      createdAt: {
        $gte: twelveMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");

    const [products, users, orders] = await Promise.all([
      lastSixMonthsProductsPromise,
      lastSixMonthsUsersPromise,
      lastTwelveMonthsOrdersPromise,
    ]);

    const productsCount = new Array(6).fill(0);
    products.forEach((product) => {
      const creationDate = product.createdAt;
      const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

      if (monthDiff < 6) {
        productsCount[6 - 1 - monthDiff] += 1;
      }
    });

    const usersCount = new Array(6).fill(0);
    users.forEach((user) => {
      const creationDate = user.createdAt;
      const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

      if (monthDiff < 6) {
        usersCount[6 - 1 - monthDiff] += 1;
      }
    });

    const ordersCount = new Array(12).fill(0);
    orders.forEach((order) => {
      const creationDate = order.createdAt;
      const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

      if (monthDiff < 12) {
        ordersCount[12 - 1 - monthDiff] += 1;
      }
    });

    charts = {
      users: usersCount,
      products: productsCount,
      orders: ordersCount,
    };

    myCache.set(key, JSON.stringify(charts));
  }

  response_200(res, true, "Bar Charts Data Fetched", charts);
  next;
});

// @admin
export const getPieData = TryCatch(async (req, res, next) => {
  let charts;
  const key = "admin-pie-charts";

  if (myCache.has(key)) {
    charts = JSON.parse(myCache.get(key) as string);
  } else {
    const allOrdersPromise = Order.find({}).select([
      "total",
      "discount",
      "subTotal",
      "tax",
      "shippingCharges",
    ]);

    const [
      processingOrderCount,
      shippedOrderCount,
      deliveredOrderCount,
      categories,
      productsCount,
      outOfStock,
      allOrders,
      allUsers,
      adminUsers,
      customerusers,
    ] = await Promise.all([
      Order.countDocuments({ status: "Processing" }),
      Order.countDocuments({ status: "Shipped" }),
      Order.countDocuments({ status: "Delivered" }),
      Product.distinct("category"),
      Product.countDocuments(),
      Product.countDocuments({ stock: 0 }),
      allOrdersPromise,
      User.find({}).select(["dob"]),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "user" }),
    ]);

    const orderFullfillment = {
      processing: processingOrderCount,
      shipped: shippedOrderCount,
      delivered: deliveredOrderCount,
    };

    const allCategoriesCountPromise = categories.map((category) =>
      Product.countDocuments({ category })
    );
    const categoriesCountOnly = await Promise.all(allCategoriesCountPromise);

    const categoryCount: Record<string, number>[] = [];
    categories.forEach((category, i) => {
      categoryCount.push({
        [category]: Math.round((categoriesCountOnly[i] / productsCount) * 100),
      });
    });

    const grossIncome = allOrders.reduce(
      (prev, order) => prev + (order.total || 0),
      0
    );
    const discount = allOrders.reduce(
      (prev, order) => prev + (order.discount || 0),
      0
    );
    const productionCost = allOrders.reduce(
      (prev, order) => prev + (order.shippingCharges || 0),
      0
    );
    const burnt = allOrders.reduce((prev, order) => prev + (order.tax || 0), 0);
    const marketingCost = Math.round(grossIncome * (20 / 100));
    const netMargin =
      grossIncome - discount - productionCost - burnt - marketingCost;

    const revenueDistribution = {
      netMargin,
      discount,
      productionCost,
      burnt,
      marketingCost,
    };

    const usersAgeGroup = {
      teen: allUsers.filter((i) => i.age < 20).length,
      adult: allUsers.filter((i) => i.age >= 20 && i.age < 40).length,
      old: allUsers.filter((i) => i.age >= 40).length,
    };

    charts = {
      orderFullfillment,
      productCategory: categoryCount,
      stockAvailability: {
        inStock: productsCount - outOfStock,
        outOfStock,
      },
      revenueDistribution,
      adminCustomer: {
        admin: adminUsers,
        customer: customerusers,
      },
      usersAgeGroup,
    };

    myCache.set(key, JSON.stringify(charts));
  }

  response_200(res, true, "Pie Charts Data Fetched", charts);
  next;
});

// @admin
export const getLineData = TryCatch(async (req, res, next) => {
  let charts;
  const key = "admin-line-charts";

  if (myCache.has(key)) {
    charts = JSON.parse(myCache.get(key) as string);
  } else {
    const today = new Date();

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const baseQuery = {
      createdAt: {
        $gte: twelveMonthsAgo,
        $lte: today,
      },
    };

    const [products, users, orders] = await Promise.all([
      Product.find(baseQuery).select("createdAt"),
      User.find(baseQuery).select("createdAt"),
      Order.find(baseQuery).select(["createdAt", "discount", "total"]),
    ]);

    const productsCount = new Array(12).fill(0);
    products.forEach((product) => {
      const creationDate = product.createdAt;
      const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

      if (monthDiff < 12) {
        productsCount[12 - 1 - monthDiff] += 1;
      }
    });

    const usersCount = new Array(12).fill(0);
    users.forEach((user) => {
      const creationDate = user.createdAt;
      const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

      if (monthDiff < 12) {
        usersCount[12 - 1 - monthDiff] += 1;
      }
    });

    const ordersCount = new Array(12).fill(0);
    orders.forEach((order) => {
      const creationDate = order.createdAt;
      const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

      if (monthDiff < 12) {
        ordersCount[12 - 1 - monthDiff] += 1;
      }
    });

    const discount = new Array(12).fill(0);
    orders.forEach((order) => {
      const creationDate = order.createdAt;
      const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

      if (monthDiff < 12) {
        discount[12 - 1 - monthDiff] += order.discount;
      }
    });

    const revenue = new Array(12).fill(0);
    orders.forEach((order) => {
      const creationDate = order.createdAt;
      const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

      if (monthDiff < 12) {
        revenue[12 - 1 - monthDiff] += order.total;
      }
    });

    charts = {
      users: usersCount,
      products: productsCount,
      discount,
      revenue,
    };

    myCache.set(key, JSON.stringify(charts));
  }

  response_200(res, true, "Bar Charts Data Fetched", charts);
  next;
});
