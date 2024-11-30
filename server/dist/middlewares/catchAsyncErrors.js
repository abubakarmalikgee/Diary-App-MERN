"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler = (theFunc) => {
    return (req, res, next) => {
        Promise.resolve(theFunc(req, res, next)).catch(next);
    };
};
exports.default = asyncHandler;
