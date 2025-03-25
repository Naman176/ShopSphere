import express from "express";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
// import { generateProducts, deleteRandomProducts } from "./utils/genera teRandomData.js";
import NodeCache from "node-cache";
import { config } from "dotenv";
import morgan from "morgan";

// Importing Routes
import productRouter from "./routes/product.js";
import userRouter from "./routes/user.js";
import orderRouter from "./routes/order.js";

// Setting up dotenv file
config({
  path: "./.env",
});

const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI || "";

connectDB(mongoURI);

// Creating Cache Instance
export const myCache = new NodeCache();

const app = express();

// Using important middlewares
app.use(express.json());
app.use(morgan("dev"));   // Gives all the info about request in the terminal

// Using Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/order", orderRouter);

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
