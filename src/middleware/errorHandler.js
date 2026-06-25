function errorHandler(err, req, res, next) {
  console.error('Error:', err.message);
  
  const status = err.status || 500;
  const code = err.code || 'INTERNAL_ERROR';
  
  res.status(status).json({
    error: err.message || 'Internal server error',
    code: code
  });
}

module.exports = errorHandler;
