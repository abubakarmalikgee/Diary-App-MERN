import mongoose, { Schema, Document, Model } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// Interface for User Document
export interface IUser extends Document {
  name: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Instance methods
  getJWTToken(): string;
  comparePassword(enteredPassword: string): Promise<boolean>;
  getResetPasswordToken(): string;
}

// User Schema
const userSchema: Schema<IUser> = new Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name cannot exceed 30 Characters"],
    minLength: [4, "Name should have more than 4 characters"],
  },
  firstname: {
    type: String,
    required: [true, "Please Enter Your First Name"],
    maxLength: [30, "First Name cannot exceed 30 Characters"],
    minLength: [4, "First Name should have more than 4 characters"],
  },
  lastname: {
    type: String,
    required: [true, "Please Enter Your Last Name"],
    maxLength: [30, "Last Name cannot exceed 30 Characters"],
    minLength: [4, "Last Name should have more than 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Password"],
    minLength: [8, "Password should be greater than 8 Characters"],
    select: false,
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, {timestamps: true});

// Pre-save middleware for password hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// JWT Token method
userSchema.methods.getJWTToken = function (): string {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET || "defaultSecret", {
    expiresIn: process.env.JWT_EXPIRE || "3d",
  });
};

// Compare Password
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate Password Reset Token
userSchema.methods.getResetPasswordToken = function (): string {
  // Generating random token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);

  return resetToken;
};

// Export the User model
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
