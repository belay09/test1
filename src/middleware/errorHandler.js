const { logger } = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error('Error:', { error: err.message, stack: err.stack });
  
  res.status(err.status || 500).render('error', {
    message: process.env.NODE_ENV === 'production' 
      ? 'An error occurred' 
      : err.message
  });
};

module.exports = { errorHandler };