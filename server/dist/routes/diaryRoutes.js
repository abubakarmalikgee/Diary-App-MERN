"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const diaryControllers_1 = require("../controllers/diaryControllers");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
// Get all diaries with filters, sorting, and pagination
router.get("/all", authMiddleware_1.isAuthenticatedUser, diaryControllers_1.getDiaries);
// Get a single diary by ID
router.get("/:id", authMiddleware_1.isAuthenticatedUser, diaryControllers_1.getDiaryById);
// Create a new diary entry
router.post("/new", authMiddleware_1.isAuthenticatedUser, diaryControllers_1.createDiary);
// Update a diary entry
router.put("/:id", authMiddleware_1.isAuthenticatedUser, diaryControllers_1.updateDiary);
// Delete a diary entry
router.delete("/:id", authMiddleware_1.isAuthenticatedUser, diaryControllers_1.deleteDiary);
exports.default = router;
