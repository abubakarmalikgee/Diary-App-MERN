"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./config/db"));
// Handling Uncaught Exceptions
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the Server due to Uncaught Exception");
    process.exit(1);
});
// Config - Loading environment variables
dotenv_1.default.config();
// Connecting to the Database
(0, db_1.default)();
// Start server
const server = app_1.default.listen(process.env.PORT, () => {
    console.log(`Server is working on hello http://localhost:${process.env.PORT}`);
});
// Handling Unhandled Promise Rejections
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the Server due to Unhandled Promise Rejections");
    server.close(() => {
        process.exit(1);
    });
});
