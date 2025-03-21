import express from "express";
import { createNewUser, getAllUsers } from "../controllers/user.js";

const userRouter = express.Router();

userRouter.post("/new", createNewUser);
userRouter.get("/all", getAllUsers);

export default userRouter;
