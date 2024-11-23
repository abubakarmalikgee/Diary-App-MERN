import { Request, Response, NextFunction } from "express";
import Diary from "../models/diaryModel";
import ErrorHandler from "../utils/errorHandler";
import asyncHandler from "../middlewares/catchAsyncErrors";
import { ApiFeatures } from "../utils/apiFeatures";

// @desc    Get all diaries (with filters, sorting, and pagination)
// @route   GET /api/v1/diary/all
// @access  Private
export const getDiaries = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get the logged-in user's ID from req.user (assumed that authentication middleware is used)
    const userId = req.user._id;

    // Initialize query with the logged-in user's ID filter
    const baseQuery = Diary.find({ user: userId });

    // Create an instance of ApiFeatures with the base query and query parameters
    const apiFeaturesForFilter = new ApiFeatures(
      baseQuery,
      req.query as Record<string, string | string[] | undefined>
    ).filter(); // Apply filtering

    // Get the total count of diaries with applied filters
    const filteredDiariesCount = await apiFeaturesForFilter.query
      .clone()
      .countDocuments();

    // Apply sorting and pagination
    const apiFeaturesWithPagination = apiFeaturesForFilter.sort().paginate();

    // Execute the final query with all features applied
    const diaries = await apiFeaturesWithPagination.query;

    // Respond with the filtered count and paginated data
    res.status(200).json({
      success: true,
      count: filteredDiariesCount, // Total diaries after applying filters
      data: diaries, // Paginated diaries
    });
  }
);

// @desc    Get a single diary by ID
// @route   GET /api/v1/diary/:id
// @access  Private
export const getDiaryById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const diary = await Diary.findById(req.params.id);

    if (!diary) {
      return next(new ErrorHandler("Diary not found", 404));
    }

    res.status(200).json({
      success: true,
      data: diary,
    });
  }
);

// @desc    Create a new diary entry
// @route   POST /api/v1/diary/new
// @access  Private
export const createDiary = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      date,
      caloriesIntake,
      energyLevel,
      vitaminsTaken,
      mood,
      exerciseTime,
      sleepQuality,
      waterIntake,
      notes,
      walkTime,
      stressLevel,
    } = req.body;
    console.log(req.body, req.user._id);
    const diary = new Diary({
      user: req.user._id, // Assuming req.user is populated by auth middleware
      date,
      caloriesIntake,
      energyLevel,
      vitaminsTaken,
      mood,
      exerciseTime,
      sleepQuality,
      waterIntake,
      notes,
      walkTime,
      stressLevel,
    });

    await diary.save();

    res.status(201).json({
      success: true,
      message: "Diary entry created successfully",
      data: diary,
    });
  }
);

// @desc    Update a diary entry by ID
// @route   PUT /api/v1/diary/:id
// @access  Private
export const updateDiary = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const diary = await Diary.findById(req.params.id);

    if (!diary) {
      return next(new ErrorHandler("Diary entry not found", 404));
    }

    // Check if the logged-in user is the owner of the diary
    if (diary.user.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler("Not authorized to update this entry", 403));
    }

    // Update the diary fields
    Object.assign(diary, req.body);

    await diary.save();

    res.status(200).json({
      success: true,
      message: "Diary entry updated successfully",
      data: diary,
    });
  }
);

// @desc    Delete a diary entry by ID
// @route   DELETE /api/v1/diary/:id
// @access  Private
export const deleteDiary = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const diary = await Diary.findById(req.params.id);

    if (!diary) {
      return next(new ErrorHandler("Diary entry not found", 404));
    }

    // Check if the logged-in user is the owner of the diary
    if (diary.user.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler("Not authorized to delete this entry", 403));
    }

    await diary.deleteOne({ _id: diary._id });

    res.status(200).json({
      success: true,
      message: "Diary entry deleted successfully",
    });
  }
);
