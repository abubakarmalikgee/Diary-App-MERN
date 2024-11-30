import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";
import asyncHandler from "../middlewares/catchAsyncErrors";
import sendEmail from "../utils/sendEmail";
import ErrorHandler from "../utils/errorHandler";
import crypto from "crypto";

// Register User
export const registerUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { firstname, lastname, email, password } = req.body;

    if (!firstname || !lastname || !email || !password) {
      return next(new ErrorHandler("All fields are required", 400));
    }
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler("User already exists", 400));
    }

    // Create new user
    await User.create({
      name: `${firstname.trim()} ${lastname}`,
      firstname,
      lastname,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  }
);

// Login User
export const loginUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      return next(
        new ErrorHandler("Please provide both email and password", 400)
      );
    }

    // Find the user by email and explicitly select the password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("Invalid credentials", 401));
    }

    // Compare the provided password with the user's stored hashed password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return next(new ErrorHandler("Invalid credentials", 401));
    }

    // Generate a JWT token
    const token = user.getJWTToken();

    // Set cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Enable secure cookies in production
      sameSite: "strict" as const, // Prevent CSRF attacks
      maxAge: Number(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000, // Convert days to milliseconds
    };

    // Send the token in an HTTP-only cookie and return the response
    res
      .status(200)
      .cookie("token", token, cookieOptions)
      .json({
        success: true,
        message: "Login successful",
        data: {
          id: user._id,
          name: user.name,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          role: user.role,
          since: user.createdAt,
        },
        token,
      });
  }
);

// Logout User
export const logoutUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Clear the authentication cookie
    res
      .status(200)
      .cookie("token", "", {
        httpOnly: true, // Ensure the cookie cannot be accessed via client-side JavaScript
        secure: process.env.NODE_ENV === "production", // Enable secure cookies in production
        sameSite: "strict" as const, // Prevent CSRF attacks
        expires: new Date(0), // Immediately expire the cookie
      })
      .json({
        success: true,
        message: "Logout successful",
      });
  }
);

// Get User Profile
export const getUserProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user; // From middleware isAuthenticatedUser

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        since: user.createdAt,
      },
    });
  }
);

// Update User Profile
export const updateUserProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { firstname, lastname } = req.body;

    const user = req.user;

    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;

    user.name = `${user.firstname.trim()} ${user.lastname.trim()}`;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        since: user.createdAt,
      },
    });
  }
);

// Forgot Password
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorHandler("User not found with this email", 404));
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();

    await user.save();

    // Create reset URL
    // const resetUrl = `${req.protocol}://${req.get(
    //   "host"
    // )}/api/v1/users/reset-password/${resetToken}`;
    const resetUrl = `${process.env.DOMAIN}/auth/resetpassword?token=${resetToken}`;

    // Email content
    const message = `You are receiving this email because you (or someone else) have requested the reset of a password. 
  Please make a change request to:\n\n${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Request",
        message,
      });

      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} with reset instructions`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return next(new ErrorHandler("Email could not be sent", 500));
    }
  }
);

// Reset Password
export const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const resetToken = req.params.resetToken;

    // Hash the token from the URL
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Find user based on the hashed token and expiration date
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorHandler("Invalid or expired reset token", 400));
    }

    // Set the new password
    user.password = req.body.password;

    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  }
);

// Update Password (Only Authenticated Users)
export const updatePassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return next(
        new ErrorHandler(
          "Both current password and new password are required",
          400
        )
      );
    }

    const user = req.user;

    if (!user) {
      return next(new ErrorHandler("User not authenticated", 401));
    }

    const dbUser = await User.findById(user._id).select("+password");

    if (!dbUser) {
      return next(new ErrorHandler("User not found", 404));
    }

    const isPasswordMatch = await dbUser.comparePassword(currentPassword);

    if (!isPasswordMatch) {
      return next(new ErrorHandler("Current password is incorrect", 400));
    }

    dbUser.password = newPassword;
    await dbUser.save();

    console.log("Password updated successfully for user:", dbUser);

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  }
);
