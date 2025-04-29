/**
 * Custom error response class
 * Extends the built-in Error class with a status code property
 */
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorResponse; 