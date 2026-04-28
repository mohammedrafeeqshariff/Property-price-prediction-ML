module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err.statusCode = 400;
    err.message = message;
  }

  // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = `JSON Web Token is invalid. Try again!!!`;
    err.statusCode = 400;
    err.message = message;
  }

  // JWT EXPIRE error
  if (err.name === "TokenExpiredError") {
    const message = `JSON Web Token is expired. Try again!!!`;
    err.statusCode = 400;
    err.message = message;
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
