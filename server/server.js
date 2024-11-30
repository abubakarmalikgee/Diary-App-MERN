import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

// Handling Uncaught Exceptions
process.on("uncaughtException", (err) => {
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
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the Server due to Unhandled Promise Rejections");

  server.close(() => {
    process.exit(1);
  });
});
