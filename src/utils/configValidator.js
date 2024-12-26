const { logger } = require('./logger');

function validateConfig() {
  const requiredVars = [
    'NODE_ENV',
    'PORT',
    'PROXY_USERNAME',
    'PROXY_PASSWORD'
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    const error = `Missing required environment variables: ${missing.join(', ')}`;
    logger.error(error);
    throw new Error(error);
  }
}

module.exports = { validateConfig };