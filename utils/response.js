/**
 * Send success response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {*} data - Response data
 * @param {string} message - Success message
 */
exports.success = (res, statusCode, data, message = '') => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Send error response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {*} error - Error details
 */
exports.error = (res, statusCode, message, error = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: error || null
  });
}; 