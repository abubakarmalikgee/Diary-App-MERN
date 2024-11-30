"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
exports.default = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    // CastError handling (MongoDB Invalid ObjectId)
    if (err.name === "CastError") {
        const message = `Resource Not Found. Invalid: ${err.path}`;
        err = new errorHandler_1.default(message, 400);
    }
    // Mongoose Duplicate Key Error handling
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new errorHandler_1.default(message, 400);
    }
    // JWT Invalid Token Error handling
    if (err.name === "JsonWebTokenError") {
        const message = `Json Web Token is invalid, try again`;
        err = new errorHandler_1.default(message, 400);
    }
    // JWT Expired Token Error handling
    if (err.name === "TokenExpiredError") {
        const message = `Json Web Token is Expired, try again`;
        err = new errorHandler_1.default(message, 400);
    }
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};
