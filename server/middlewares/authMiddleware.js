import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";

export const isAuthenticatedUser = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  try {
    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      new ErrorHandler("Invalid token, Unauthorized access", 401);
    }

    // Attach the user to the request object
    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    return next(
      new ErrorHandler("Not authorized to access this resource", 401)
    );
  }
};
