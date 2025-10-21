/**
 * Global error handler middleware
 * Handles errors and provides appropriate responses
 * Hides sensitive information in production
 */
export const errorHandler = (err, req, res, next) => {
  // Log error details for debugging (server-side only)
  console.error('Error occurred:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Determine status code (default to 500 if not set)
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  // Check if we're in development or production
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Send appropriate error response
  res.status(statusCode).json({
    success: false,
    message: isDevelopment 
      ? err.message 
      : 'An error occurred while processing your request',
    // Only include stack trace in development
    ...(isDevelopment && { stack: err.stack }),
  });
};

/**
 * Handle 404 - Route not found
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
