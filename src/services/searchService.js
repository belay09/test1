const puppeteer = require('puppeteer');
const NodeCache = require('node-cache');
const { logger } = require('../utils/logger');
const { ProxyManager } = require('../utils/proxyManager');

const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour
const proxyManager = new ProxyManager();

class SearchService {
  async search(query) {
    const cacheKey = `search:${query}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      logger.info('Returning cached search results', { query });
      return cached;
    }

    try {
      const browser = await puppeteer.launch({
        executablePath: '/usr/bin/google-chrome', // Update this path
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true
      });
      const page = await browser.newPage();
      
      // Use proxy rotation
      const proxy = await proxyManager.getProxy();
      if (proxy) {
        await page.authenticate(proxy);
      }

      // Perform the search
      await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}`);
      
      // Extract search results
      const results = await page.evaluate(() => {
        const searchResults = [];
        const elements = document.querySelectorAll('.g');
        
        elements.forEach(element => {
          const titleElement = element.querySelector('h3');
          const linkElement = element.querySelector('a');
          const snippetElement = element.querySelector('.VwiC3b');
          
          if (titleElement && linkElement && snippetElement) {
            searchResults.push({
              title: titleElement.innerText,
              url: linkElement.href,
              snippet: snippetElement.innerText
            });
          }
        });
        
        return searchResults;
      });

 
      await browser.close();
      cache.set(cacheKey, results);
      return results;
    } catch (error) {
      logger.error('Search error', { error });
      throw error;
    }
  }
}

module.exports = new SearchService();