import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*", // Applies to all web crawlers (Google, Bing, etc.)
      allow: "/", // Allow crawling of all public pages
      disallow: [
        "/dashboard/", // Keep bots out of private user areas
        "/api/", // Keep bots away from your backend routes
      ],
    },
    sitemap: "https://phixl.online/sitemap.xml", // Points bots to the file we made in Step 1
  };
}
