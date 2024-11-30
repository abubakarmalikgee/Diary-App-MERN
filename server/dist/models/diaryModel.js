"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Mongoose Schema for Diary
const DiarySchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
    caloriesIntake: {
        type: Number,
        required: true,
        min: [0, "Calories intake cannot be negative"],
    },
    energyLevel: {
        type: Number,
        required: true,
        min: [1, "Energy level must be at least 1"],
        max: [10, "Energy level cannot exceed 10"],
    },
    vitaminsTaken: {
        type: Boolean,
        required: true,
    },
    mood: {
        type: String,
        required: true,
        enum: ["happy", "sad", "neutral", "anxious", "excited", "tired"],
    },
    exerciseTime: {
        type: Number,
        required: true,
        min: [0, "Exercise time cannot be negative"],
    },
    sleepQuality: {
        type: Number,
        required: true,
        min: [1, "Sleep quality must be at least 1"],
        max: [10, "Sleep quality cannot exceed 10"],
    },
    waterIntake: {
        type: Number,
        min: [0, "Water intake cannot be negative"],
    },
    notes: {
        type: String,
        trim: true,
        maxLength: [500, "Notes cannot exceed 500 characters"],
    },
    walkTime: {
        type: Number,
        min: [0, "Walking time cannot be negative"],
        default: 0, // Optional field but defaults to 0 if not provided
    },
    stressLevel: {
        type: Number,
        min: [1, "Stress level must be at least 1"],
        max: [10, "Stress level cannot exceed 10"],
    },
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
});
// Create and Export Diary Model
const Diary = mongoose_1.default.model("Diary", DiarySchema);
exports.default = Diary;
