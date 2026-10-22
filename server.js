
const express = require("express");
const logger = require("./logger");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Log incoming requests
app.use((req, res, next) => {
  logger.info("Incoming request", {
    method: req.method,
    url: req.originalUrl,
  });

  next();
});

// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Home route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Day 27 Error Logging API is running",
  });
});

// Successful API test
app.get("/api/success", (req, res) => {
  res.json({
    success: true,
    message: "API working successfully",
  });
});

// Test global error handler
app.get("/api/test-error", (req, res, next) => {
  next(new AppError("This is a test error", 500));
});

// Validate user input
app.get("/api/user", (req, res, next) => {
  const { name } = req.query;

  if (!name) {
    return next(new AppError("Name is required", 400));
  }

  res.json({
    success: true,
    user: { name },
  });
});

// Handle unknown routes
app.use((req, res, next) => {
  next(new AppError("Route not found", 404));
});

// Global error handler (must be last)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  logger.error("Request failed", {
    message: err.message,
    statusCode,
    method: req.method,
    url: req.originalUrl,
    stack: err.stack,
  });

  res.status(statusCode).json({
    success: false,
    message:
      statusCode >= 500
        ? "Internal server error"
        : err.message,
  });
});

// Start server
app.listen(PORT, () => {
  logger.info("Server started", { port: PORT });
  console.log(`Server running at http://localhost:${PORT}`);
});
