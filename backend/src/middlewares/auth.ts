import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility_class.js";
import { TryCatch } from "./error.js";

// Middleware to authorize admin routes
export const isAdmin = TryCatch(async (req, res, next) => {
  const { id } = req.query;

  if (!id) {
    return next(new ErrorHandler("Login first", 401));
  }

  const user = await User.findById(id);
  if (!user) {
    return next(new ErrorHandler("Not a valid user", 404));
  }

  if (user.role !== "admin") {
    return next(new ErrorHandler("Unauthorized access", 401));
  }

  next();
});
