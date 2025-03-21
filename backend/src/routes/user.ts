import express from "express";
import {
  createNewUser,
  deleteUser,
  getAllUsers,
  getUserProfile,
} from "../controllers/user.js";
import { isAdmin } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/new", createNewUser);
userRouter.get("/all", isAdmin, getAllUsers);
userRouter.route("/:id").get(getUserProfile).delete(isAdmin, deleteUser);

export default userRouter;
