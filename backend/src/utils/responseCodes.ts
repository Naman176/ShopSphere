import { Response } from "express";
import { Document } from "mongoose";

// Function to send a 200 OK response
export const response_200 = (
  res: Response,
  success: boolean,
  message: string,
  data: Document | Document[] | string[] | number,
  utilData?: number | string
) => {
  return res.status(200).json({
    success,
    status: "OK", // Status of the response
    message, // Custom message
    data, // Data returned in the response
    utilData,
  });
};

// Function to send a 201 Created response
export const response_201 = (
  res: Response,
  success: boolean,
  message: string,
  data?: Document | Document[] | string
) => {
  return res.status(201).json({
    success,
    status: "Inserted", // Status indicating a resource was created
    message, // Custom message
    data,
  });
};

// Function to send a 204 No Content response
export const response_204 = (
  res: Response,
  success: boolean,
  message: string
) => {
  return res.status(204).json({
    success,
    status: "No content", // Status indicating no content to return
    message, // Custom message
  });
};

// Function to send a 400 Bad Request response
export const response_400 = (
  res: Response,
  success: boolean,
  message: string
) => {
  return res.status(400).json({
    success,
    status: "error", // Status indicating an error occurred
    error: message, // Custom error message
  });
};

// Function to send a 401 Unauthorized response
export const response_401 = (
  res: Response,
  success: boolean,
  message: string
) => {
  return res.status(401).json({
    success,
    status: "error", // Status indicating unauthorized access
    error: message, // Custom error message
  });
};

// Function to send a 403 Forbidden response
export const response_403 = (
  res: Response,
  success: boolean,
  message: string
) => {
  return res.status(403).json({
    success,
    status: "error", // Status indicating forbidden access
    error: message, // Custom error message
  });
};

// Function to send a 404 Not Found response
export const response_404 = (
  res: Response,
  success: boolean,
  message: string
) => {
  return res.status(404).json({
    success,
    status: "error", // Status indicating the resource was not found
    error: message, // Custom error message
  });
};

// Function to send a 500 Internal Server Error response
export const response_500 = (
  res: Response,
  success: boolean,
  message: string,
  err: Error
) => {
  // Creating a message that includes the error if it exists
  const msg = err != null ? `${message}: ${err}` : message;

  // Log the error message for debugging
  console.debug(message);

  return res.status(500).json({
    success,
    status: "error", // Status indicating a server error
    error: `Something went wrong. ${message}`, // Custom error message
  });
};
