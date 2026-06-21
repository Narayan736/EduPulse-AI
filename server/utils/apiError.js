/**
 * Custom API error class with HTTP status code.
 * Throw this in controllers and let the global error handler catch it.
 */
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
