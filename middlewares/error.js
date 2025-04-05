const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log full error in development, sanitized in production
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  } else {
    // In production, log without sensitive data
    console.error({
      path: req.path,
      statusCode: error.status || 500,
      errorType: err.name,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found`;
    error = { message, status: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, status: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message, status: 400 };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token. Please log in again.';
    error = { message, status: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Your token has expired. Please log in again.';
    error = { message, status: 401 };
  }

  // Respond with error
  res.status(error.status || 500).json({
    success: false,
    error: error.message || 'Server Error',
    // Only include stack trace in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler; 