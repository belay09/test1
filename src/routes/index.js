const express = require('express');
const { searchController } = require('../controllers/searchController');
const axios = require('axios');

function setupRoutes(app) {
  const router = express.Router();
  // Home page
  router.get('/', (req, res) => {
    res.render('index');
  });
  // Search route
  router.get('/search', searchController);

  // Scrape and display website
  router.get('/scrape', async (req, res) => {
    const { url } = req.query;

    try {
      const response = await axios.get(url);
      res.send(response.data);
    } catch (error) {
      console.error('Error fetching website:', error);
      res.status(500).send('Failed to fetch website.');
    }
  });
  app.use('/', router);
}

module.exports = { setupRoutes };