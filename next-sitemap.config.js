/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://greyform.org",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  outDir: "./public",
  changefreq: "monthly",
  priority: 0.7,
  exclude: ["/api/*", "/opengraph-image*", "/_*"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    additionalSitemaps: ["https://greyform.org/sitemap.xml"],
  },
  // Per-route overrides — bump priority for the high-intent surfaces.
  transform: async (config, path) => {
    const priorities = {
      "/": 1.0,
      "/work": 0.9,
      "/services": 0.9,
      "/start": 0.9,
      "/about": 0.7,
    };
    const fallback = path.startsWith("/work/") ? 0.8 : 0.6;
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: priorities[path] ?? fallback,
      lastmod: new Date().toISOString(),
    };
  },
};
