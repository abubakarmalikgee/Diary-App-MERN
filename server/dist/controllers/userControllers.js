"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.resetPassword = exports.forgotPassword = exports.updateUserProfile = exports.getUserProfile = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const catchAsyncErrors_1 = __importDefault(require("../middlewares/catchAsyncErrors"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const crypto_1 = __importDefault(require("crypto"));
// Register User
exports.registerUser = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstname, lastname, email, password } = req.body;
    if (!firstname || !lastname || !email || !password) {
        return next(new errorHandler_1.default("All fields are required", 400));
    }
    // Check if the user already exists
    const existingUser = yield userModel_1.default.findOne({ email });
    if (existingUser) {
        return next(new errorHandler_1.default("User already exists", 400));
    }
    // Create new user
    yield userModel_1.default.create({
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
}));
// Login User
exports.loginUser = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Validate input fields
    if (!email || !password) {
        return next(new errorHandler_1.default("Please provide both email and password", 400));
    }
    // Find the user by email and explicitly select the password field
    const user = yield userModel_1.default.findOne({ email }).select("+password");
    if (!user) {
        return next(new errorHandler_1.default("Invalid credentials", 401));
    }
    // Compare the provided password with the user's stored hashed password
    const isPasswordMatch = yield user.comparePassword(password);
    if (!isPasswordMatch) {
        return next(new errorHandler_1.default("Invalid credentials", 401));
    }
    // Generate a JWT token
    const token = user.getJWTToken();
    // Set cookie options
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Enable secure cookies in production
        sameSite: "strict", // Prevent CSRF attacks
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
}));
// Logout User
exports.logoutUser = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Clear the authentication cookie
    res
        .status(200)
        .cookie("token", "", {
        httpOnly: true, // Ensure the cookie cannot be accessed via client-side JavaScript
        secure: process.env.NODE_ENV === "production", // Enable secure cookies in production
        sameSite: "strict", // Prevent CSRF attacks
        expires: new Date(0), // Immediately expire the cookie
    })
        .json({
        success: true,
        message: "Logout successful",
    });
}));
// Get User Profile
exports.getUserProfile = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
}));
// Update User Profile
exports.updateUserProfile = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstname, lastname } = req.body;
    const user = req.user;
    if (firstname)
        user.firstname = firstname;
    if (lastname)
        user.lastname = lastname;
    user.name = `${user.firstname.trim()} ${user.lastname.trim()}`;
    yield user.save();
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
}));
// Forgot Password
exports.forgotPassword = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    // Check if user exists
    const user = yield userModel_1.default.findOne({ email });
    if (!user) {
        return next(new errorHandler_1.default("User not found with this email", 404));
    }
    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    yield user.save();
    // Create reset URL
    // const resetUrl = `${req.protocol}://${req.get(
    //   "host"
    // )}/api/v1/users/reset-password/${resetToken}`;
    const resetUrl = `${req.protocol}://${req.get("host")}/auth/resetpassword?token=${resetToken}`;
    // Email content
    const message = `You are receiving this email because you (or someone else) have requested the reset of a password. 
  Please make a change request to:\n\n${resetUrl}`;
    try {
        yield (0, sendEmail_1.default)({
            email: user.email,
            subject: "Password Reset Request",
            message,
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} with reset instructions`,
        });
    }
    catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        yield user.save();
        return next(new errorHandler_1.default("Email could not be sent", 500));
    }
}));
// Reset Password
exports.resetPassword = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const resetToken = req.params.resetToken;
    // Hash the token from the URL
    const hashedToken = crypto_1.default
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    // Find user based on the hashed token and expiration date
    const user = yield userModel_1.default.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
        return next(new errorHandler_1.default("Invalid or expired reset token", 400));
    }
    // Set the new password
    user.password = req.body.password;
    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    yield user.save();
    res.status(200).json({
        success: true,
        message: "Password has been reset successfully",
    });
}));
// Update Password (Only Authenticated Users)
exports.updatePassword = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentPassword, newPassword } = req.body;
    // Validate input
    if (!currentPassword || !newPassword) {
        return next(new errorHandler_1.default("Both current password and new password are required", 400));
    }
    const user = req.user;
    if (!user) {
        return next(new errorHandler_1.default("User not authenticated", 401));
    }
    const dbUser = yield userModel_1.default.findById(user._id).select("+password");
    if (!dbUser) {
        return next(new errorHandler_1.default("User not found", 404));
    }
    const isPasswordMatch = yield dbUser.comparePassword(currentPassword);
    if (!isPasswordMatch) {
        return next(new errorHandler_1.default("Current password is incorrect", 400));
    }
    dbUser.password = newPassword;
    yield dbUser.save();
    console.log("Password updated successfully for user:", dbUser);
    res.status(200).json({
        success: true,
        message: "Password updated successfully",
    });
}));
