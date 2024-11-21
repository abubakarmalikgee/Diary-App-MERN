import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/errorHandler";

// Base interface for errors with a status code
interface ErrorWithStatusCode extends Error {
  statusCode: number;
}

// Interface for MongoDB CastError
interface CastError extends ErrorWithStatusCode {
  name: "CastError";
  path: string; // MongoDB CastError has the `path` property
}

// Interface for MongoDB Duplicate Key Error
interface DuplicateKeyError extends ErrorWithStatusCode {
  code: 11000; // MongoDB duplicate key error code
  keyValue: Record<string, any>; // Contains the duplicated keys
}

// Interface for JWT Errors
interface JWTError extends ErrorWithStatusCode {
  name: "JsonWebTokenError" | "TokenExpiredError";
}

export default (
  err: ErrorWithStatusCode,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // CastError handling (MongoDB Invalid ObjectId)
  if ((err as CastError).name === "CastError") {
    const message = `Resource Not Found. Invalid: ${(err as CastError).path}`;
    err = new ErrorHandler(message, 400);
  }

  // Mongoose Duplicate Key Error handling
  if ((err as DuplicateKeyError).code === 11000) {
    const message = `Duplicate ${Object.keys(
      (err as DuplicateKeyError).keyValue
    )} Entered`;
    err = new ErrorHandler(message, 400);
  }

  // JWT Invalid Token Error handling
  if ((err as JWTError).name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, try again`;
    err = new ErrorHandler(message, 400);
  }

  // JWT Expired Token Error handling
  if ((err as JWTError).name === "TokenExpiredError") {
    const message = `Json Web Token is Expired, try again`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
