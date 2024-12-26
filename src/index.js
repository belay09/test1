require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { setupRoutes } = require('./routes');
const { logger } = require('./utils/logger');
const { errorHandler } = require('./middleware/errorHandler');
const { validateConfig } = require('./utils/configValidator');

// Validate required environment variables
validateConfig();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware with adjusted CSP for WebContainer
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  })
);
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Ensure public directory exists
const publicDir = path.join(__dirname, 'public');
if (!require('fs').existsSync(publicDir)) {
  require('fs').mkdirSync(publicDir, { recursive: true });
}

// Static files
app.use(express.static(publicDir));
app.use('/css', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/css')));

// Routes
setupRoutes(app);

// Error handling
app.use(errorHandler);

// Allow connections from any host in development
const host = process.env.NODE_ENV === 'production' ? 'localhost' : '0.0.0.0';

app.listen(PORT, host, () => {
  logger.info(`Server is running on ${host}:${PORT}`);
});