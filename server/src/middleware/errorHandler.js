function errorHandler(err, _req, res, _next) {
  console.error("Unhandled error:", err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    error: {
      code: err.code || "INTERNAL_ERROR",
      message: status === 500 ? "An unexpected error occurred" : err.message,
    },
  });
}

module.exports = errorHandler;
