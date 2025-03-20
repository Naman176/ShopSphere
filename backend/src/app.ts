import express from "express";
import { connectDB } from "./utils/features.js";

// Importing Routes
import userRoute from "./routes/user.js";
import { errorMiddleware } from "./middlewares/error.js";

const port = 3000;

connectDB();
const app = express();

// Using important middlewares
app.use(express.json());

// Using Routes
app.use("/api/v1/user", userRoute);

// Error Middleware from error.ts
app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("API Working...");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
