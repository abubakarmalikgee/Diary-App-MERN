import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
// import path from "path";
import cors from "cors";

// Import Routes
import userRoute from "./routes/userRoutes.js";
import diaryRoute from "./routes/diaryRoutes.js";

// Import Middleware
import errorMiddleware from "./middlewares/errorMiddleware.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(helmet()); // Basic security headers

app.use(
  cors({
    origin: ["https://diary-app-mern.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Logger Middleware
app.use(morgan("combined")); // Use Apache combined format for detailed logs

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/diary", diaryRoute);

// app.use(express.static(path.join(__dirname, "../../client/dist")));
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../../client/dist/index.html"));
// });

// Error Middleware
app.use(errorMiddleware);

export default app;
