const HttpProxyAgent = require('http-proxy-agent');

class ProxyManager {
  constructor() {
    // In a production environment, you would load these from a database or external service
    this.proxies = [
      { host: 'proxy1.example.com', port: 8080 },
      { host: 'proxy2.example.com', port: 8080 }
    ];
    this.currentIndex = 0;
  }

  async getProxy() {
    // Rotate through available proxies
    const proxy = this.proxies[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.proxies.length;
    
    return {
      username: process.env.PROXY_USERNAME,
      password: process.env.PROXY_PASSWORD,
      host: proxy.host,
      port: proxy.port
    };
  }
}

module.exports = { ProxyManager };