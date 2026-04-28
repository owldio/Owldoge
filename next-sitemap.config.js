/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.owldio.art',
  generateRobotsTxt: true,
  exclude: ['/contact/success'],
  changefreq: 'weekly',
  priority: 0.8,
  transform: async (config, path) => {
    // 設定不同頁面的優先級
    let priority = 0.7;
    let changefreq = 'weekly';
    
    if (path === '/') {
      priority = 1.0; // 首頁最高優先級
      changefreq = 'weekly';
    } else if (path === '/services' || path === '/pricing') {
      priority = 0.9; // 核心服務頁面高優先級
      changefreq = 'weekly';
    } else if (path === '/about' || path === '/contact') {
      priority = 0.8; // 重要頁面
      changefreq = 'monthly';
    } else if (path === '/portfolio' || path === '/student-projects') {
      priority = 0.7; // 次要頁面
      changefreq = 'monthly';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/contact/success', '/_next/', '/api/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/contact/success'],
      },
    ],
    additionalSitemaps: [],
  },
};