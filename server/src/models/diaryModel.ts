import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for Diary Document
export interface IDiary extends Document {
  user: mongoose.Types.ObjectId; // Reference to User
  date: Date;
  caloriesIntake: number;
  energyLevel: number; // Range: 1-10
  vitaminsTaken: boolean;
  mood: "Happy" | "Sad" | "Neutral" | "Anxious" | "Excited" | "Tired";
  exerciseTime: number; // In minutes
  sleepQuality: number; // Range: 1-10
  waterIntake?: number; // Optional, in liters
  notes?: string; // Optional custom notes
  walkTime?: number; // Optional, walking time in minutes
  stressLevel?: number; // Optional, Range: 1-10
}

// Mongoose Schema for Diary
const DiarySchema: Schema = new Schema<IDiary>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
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
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create and Export Diary Model
const Diary: Model<IDiary> = mongoose.model<IDiary>("Diary", DiarySchema);

export default Diary;
