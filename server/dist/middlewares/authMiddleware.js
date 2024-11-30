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
exports.isAuthenticatedUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const isAuthenticatedUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.cookies;
    if (!token) {
        return next(new errorHandler_1.default("Please login to access this resource", 401));
    }
    try {
        // Decode the token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            new errorHandler_1.default("Invalid token, Unauthorized access", 401);
        }
        // Attach the user to the request object
        req.user = yield userModel_1.default.findById(decoded.id);
        next();
    }
    catch (error) {
        return next(new errorHandler_1.default("Not authorized to access this resource", 401));
    }
});
exports.isAuthenticatedUser = isAuthenticatedUser;
