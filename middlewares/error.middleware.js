// const errorHandler = (err, req, res, next) => {
//   const statusCode = res.statusCode ? res.statusCode : 500;

//   res.status(statusCode);

//   res.json({
//     message: err.message,
//     stack: process.env.NODE_ENV === 'development' ? err.stack : null,
//   });
// };

// module.exports = errorHandler;


const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  const errorDetails = {
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
    status: statusCode,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : null,
  };

  // Log the error details (optional)
  console.error(errorDetails);

  res.status(statusCode).json(errorDetails);
};

module.exports = errorHandler;