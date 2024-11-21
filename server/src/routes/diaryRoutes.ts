import express from "express";
import {
  getDiaries,
  getDiaryById,
  createDiary,
  updateDiary,
  deleteDiary,
} from "../controllers/diaryControllers";
import { isAuthenticatedUser } from "../middlewares/authMiddleware";

const router = express.Router();

// Get all diaries with filters, sorting, and pagination
router.get("/all", isAuthenticatedUser, getDiaries);

// Get a single diary by ID
router.get("/:id", isAuthenticatedUser, getDiaryById);

// Create a new diary entry
router.post("/new", isAuthenticatedUser, createDiary);

// Update a diary entry
router.put("/:id", isAuthenticatedUser, updateDiary);

// Delete a diary entry
router.delete("/:id", isAuthenticatedUser, deleteDiary);

export default router;
