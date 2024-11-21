import express from "express";
import {
  forgotPassword,
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updatePassword,
  updateUserProfile,
} from "../controllers/userControllers";
import { isAuthenticatedUser } from "../middlewares/authMiddleware";

const router = express.Router();

// Register User
router.post("/register", registerUser);

// Login User
router.post("/login", loginUser);

// Logout User
router.post("/logout", logoutUser);

// Get User Profile (Only Authenticated Users)
router.get("/me", isAuthenticatedUser, getUserProfile);

// Update User Profile (Only Authenticated Users)
router.put("/me", isAuthenticatedUser, updateUserProfile);
// Forgot Password (Send Reset Link)
router.post("/forgot-password", forgotPassword);

// Reset Password (Reset the Password using Reset Token)
router.put("/reset-password/:resetToken", resetPassword);

// Update Password (Only Authenticated Users)
router.put("/update-password", isAuthenticatedUser, updatePassword);

export default router;
