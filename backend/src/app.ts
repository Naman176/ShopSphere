import express from "express";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
// import { generateProducts, deleteRandomProducts } from "./utils/genera teRandomData.js";
import NodeCache from "node-cache";
import { config } from "dotenv";
import morgan from "morgan";
import Stripe from "stripe";
import cors from "cors";

// Importing Routes
import productRouter from "./routes/product.js";
import userRouter from "./routes/user.js";
import orderRouter from "./routes/order.js";
import paymentRouter from "./routes/payment.js";
import dashboardRouter from "./routes/dashboard.js";

// Setting up dotenv file
config({
  path: "./.env",
});

const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI || "";
const stripeKey = process.env.STRIPE_KEY || "";

// Connecting to DB
connectDB(mongoURI);

// Creating Cache Instance
export const myCache = new NodeCache();

// Creating Stripe Instance
export const stripe = new Stripe(stripeKey);

const app = express();

// Using important middlewares
app.use(express.json());
app.use(morgan("dev")); // Gives all the info about request in the terminal
app.use(cors());

// Using Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/dashboard", dashboardRouter);

// Making uploads static folder so that it is accessible
app.use("/uploads", express.static("uploads"));

// Error Middleware from error.ts
app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("API Working...");
});

// generateProducts(41)
// deleteRandomProducts(41)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
