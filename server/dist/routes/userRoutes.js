"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userControllers_1 = require("../controllers/userControllers");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
// Register User
router.post("/register", userControllers_1.registerUser);
// Login User
router.post("/login", userControllers_1.loginUser);
// Logout User
router.post("/logout", userControllers_1.logoutUser);
// Get User Profile (Only Authenticated Users)
router.get("/me", authMiddleware_1.isAuthenticatedUser, userControllers_1.getUserProfile);
// Update User Profile (Only Authenticated Users)
router.put("/me", authMiddleware_1.isAuthenticatedUser, userControllers_1.updateUserProfile);
// Forgot Password (Send Reset Link)
router.post("/forgot-password", userControllers_1.forgotPassword);
// Reset Password (Reset the Password using Reset Token)
router.put("/reset-password/:resetToken", userControllers_1.resetPassword);
// Update Password (Only Authenticated Users)
router.put("/update-password", authMiddleware_1.isAuthenticatedUser, userControllers_1.updatePassword);
exports.default = router;
