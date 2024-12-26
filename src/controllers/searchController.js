const searchService = require('../services/searchService');
const { logger } = require('../utils/logger');

const searchController = async (req, res, next) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.render('search', { results: [] });
    }

    const results = await searchService.search(q);
    res.render('search', { results, query: q });
  } catch (error) {
    logger.error('Search controller error:', error);
    next(error);
  }
};

module.exports = { searchController };