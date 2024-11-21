import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

// Import Routes
import userRoute from "./routes/userRoutes";
import diaryRoute from "./routes/diaryRoutes";

// Import Middleware
import errorMiddleware from "./middlewares/errorMiddleware";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(helmet()); // Basic security headers

// CORS - Configure for your frontend domain in production
app.use(
  cors({
    origin: "http://localhost:3000", // Allow only frontend to make request
    methods: ["GET", "POST", "PUT", "DELETE"], // Define allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Define allowed headers
  })
);

// Logger Middleware
app.use(morgan("combined")); // Use Apache combined format for detailed logs

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/diary", diaryRoute);

// Error Middleware
app.use(errorMiddleware);

export default app;
