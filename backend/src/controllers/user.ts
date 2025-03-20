import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";
import { TryCatch } from "../middlewares/error.js";
import { NewUserRequestBody } from "../types/types.js";

export const newUser = TryCatch(
  async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { _id, name, email, photo, gender, dob } = req.body;

    const user = await User.create({
      _id,
      name,
      email,
      photo,
      gender,
      dob: new Date(dob),
    });

    res.status(201).json({
      success: true,
      message: `Welcome, ${user.name}`,
    });
    return next();
  }
);
