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
exports.deleteDiary = exports.updateDiary = exports.createDiary = exports.getDiaryById = exports.getDiaries = void 0;
const diaryModel_1 = __importDefault(require("../models/diaryModel"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const catchAsyncErrors_1 = __importDefault(require("../middlewares/catchAsyncErrors"));
const apiFeatures_1 = require("../utils/apiFeatures");
// @desc    Get all diaries (with filters, sorting, and pagination)
// @route   GET /api/v1/diary/all
// @access  Private
exports.getDiaries = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Get the logged-in user's ID from req.user (assumed that authentication middleware is used)
    const userId = req.user._id;
    // Initialize query with the logged-in user's ID filter
    const baseQuery = diaryModel_1.default.find({ user: userId });
    // Create an instance of ApiFeatures with the base query and query parameters
    const apiFeaturesForFilter = new apiFeatures_1.ApiFeatures(baseQuery, req.query).filter(); // Apply filtering
    // Get the total count of diaries with applied filters
    const filteredDiariesCount = yield apiFeaturesForFilter.query
        .clone()
        .countDocuments();
    // Apply sorting and pagination
    const apiFeaturesWithPagination = apiFeaturesForFilter.sort().paginate();
    // Execute the final query with all features applied
    const diaries = yield apiFeaturesWithPagination.query;
    // Respond with the filtered count and paginated data
    res.status(200).json({
        success: true,
        count: filteredDiariesCount, // Total diaries after applying filters
        data: diaries, // Paginated diaries
    });
}));
// @desc    Get a single diary by ID
// @route   GET /api/v1/diary/:id
// @access  Private
exports.getDiaryById = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const diary = yield diaryModel_1.default.findById(req.params.id);
    if (!diary) {
        return next(new errorHandler_1.default("Diary not found", 404));
    }
    res.status(200).json({
        success: true,
        data: diary,
    });
}));
// @desc    Create a new diary entry
// @route   POST /api/v1/diary/new
// @access  Private
exports.createDiary = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, caloriesIntake, energyLevel, vitaminsTaken, mood, exerciseTime, sleepQuality, waterIntake, notes, walkTime, stressLevel, } = req.body;
    console.log(req.body, req.user._id);
    const diary = new diaryModel_1.default({
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
    yield diary.save();
    res.status(201).json({
        success: true,
        message: "Diary entry created successfully",
        data: diary,
    });
}));
// @desc    Update a diary entry by ID
// @route   PUT /api/v1/diary/:id
// @access  Private
exports.updateDiary = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const diary = yield diaryModel_1.default.findById(req.params.id);
    if (!diary) {
        return next(new errorHandler_1.default("Diary entry not found", 404));
    }
    // Check if the logged-in user is the owner of the diary
    if (diary.user.toString() !== req.user._id.toString()) {
        return next(new errorHandler_1.default("Not authorized to update this entry", 403));
    }
    // Update the diary fields
    Object.assign(diary, req.body);
    yield diary.save();
    res.status(200).json({
        success: true,
        message: "Diary entry updated successfully",
        data: diary,
    });
}));
// @desc    Delete a diary entry by ID
// @route   DELETE /api/v1/diary/:id
// @access  Private
exports.deleteDiary = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const diary = yield diaryModel_1.default.findById(req.params.id);
    if (!diary) {
        return next(new errorHandler_1.default("Diary entry not found", 404));
    }
    // Check if the logged-in user is the owner of the diary
    if (diary.user.toString() !== req.user._id.toString()) {
        return next(new errorHandler_1.default("Not authorized to delete this entry", 403));
    }
    yield diary.deleteOne({ _id: diary._id });
    res.status(200).json({
        success: true,
        message: "Diary entry deleted successfully",
    });
}));
