/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://owldio.art',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
    ],
  },
};