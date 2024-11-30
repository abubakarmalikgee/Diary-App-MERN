"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
// import path from "path";
const cors_1 = __importDefault(require("cors"));
// Import Routes
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const diaryRoutes_1 = __importDefault(require("./routes/diaryRoutes"));
// Import Middleware
const errorMiddleware_1 = __importDefault(require("./middlewares/errorMiddleware"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)()); // Basic security headers
app.use((0, cors_1.default)({
    origin: ["https://diary-app-mern.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// Logger Middleware
app.use((0, morgan_1.default)("combined")); // Use Apache combined format for detailed logs
// Routes
app.use("/api/v1/user", userRoutes_1.default);
app.use("/api/v1/diary", diaryRoutes_1.default);
// app.use(express.static(path.join(__dirname, "../../client/dist")));
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../../client/dist/index.html"));
// });
// Error Middleware
app.use(errorMiddleware_1.default);
exports.default = app;
