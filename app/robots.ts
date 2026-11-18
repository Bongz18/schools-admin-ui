import type { MetadataRoute } from "next";

// Tells search engines what to crawl. Admin, private previews and login pages stay out.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/preview", "/api", "/login", "/reset-password", "/unauthorized"],
    },
    sitemap: "https://www.schoolspot.co.zw/sitemap.xml",
  };
}
