class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

function notFoundHandler(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for ${err.path}`;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
}

module.exports = {
  ApiError,
  notFoundHandler,
  errorHandler,
};
