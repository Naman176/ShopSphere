import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";
import { TryCatch } from "../middlewares/error.js";
import { NewUserRequestBody } from "../types/types.js";
import ErrorHandler from "../utils/utility_class.js";
import {
  response_200,
  response_201,
  response_400,
} from "../utils/responseCodes.js";


// @user
export const createNewUser = TryCatch(
  async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { _id, name, email, photo, gender, dob } = req.body;

    // If sign in via google (already a user)
    let user = await User.findById(_id);
    if (user) {
      response_200(res, true, `Welcome, ${user.name}`, user);
      return;

      // res.status(200).json({
      //   success: true,
      //   message: `Welcome, ${user.name}`,
      // });
      // return;
    }
 
    if (!_id || !name || !email || !photo || !gender || !dob) {
      // can be done using response codes files in utils instead of next method

      // response_400(res, false, "All fields are required");
      // return;

      return next(new ErrorHandler("All fields are required", 400));
    }

    user = await User.create({
      _id,
      name,
      email,
      photo,
      gender,
      dob: new Date(dob),
    });

    response_201(res, true, `Welcome, ${user.name}`);
    // res.status(201).json({
    //   success: true,
    //   message: `Welcome, ${user.name}`,
    // });
    return;
  }
);


// @admin
export const getAllUsers = TryCatch(async (req, res, next) => {
  const users = await User.find({});
  response_200(res, true, "All users fetched", users);
  // res.status(200).json({
  //   success: true,
  //   users,
  // });
  return;
});


// @user
export const getUserProfile = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  response_200(res, true, "User details fetched", user);
  return;
});


// @admin
export const deleteUser = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  await user.deleteOne();

  response_200(res, true, "User deleted", user);
  return;
});
