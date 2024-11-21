import dotenv from "dotenv";
import app from "./app";
import connectDB from "./config/db";

// Handling Uncaught Exceptions
process.on("uncaughtException", (err: Error) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the Server due to Uncaught Exception");
  process.exit(1);
});

// Config - Loading environment variables
dotenv.config();

// Connecting to the Database
connectDB();

// Start server
const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server is working on hello http://localhost:${process.env.PORT}`
  );
});

// Handling Unhandled Promise Rejections
process.on("unhandledRejection", (err: Error) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the Server due to Unhandled Promise Rejections");

  server.close(() => {
    process.exit(1);
  });
});
