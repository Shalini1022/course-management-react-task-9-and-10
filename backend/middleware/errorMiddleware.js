// eslint-disable-next-line no-unused-vars
function errorHandler(error, req, res, next) {
  // Malformed JSON body
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON in request body" });
  }

  const statusCode = error.statusCode || 500;

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({
    message: statusCode >= 500 ? "Internal server error" : error.message,
  });
}

module.exports = errorHandler;
