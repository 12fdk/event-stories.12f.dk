import { defineConfig } from "astro/config";
import fs from "node:fs";
import path from "node:path";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

const SITE = "https://event-stories.12f.dk";
const BLOG_DIR = "src/content/blog";

/**
 * lastmod per blog post, read from its own frontmatter (updatedDate if it has
 * one, else publishDate). A date is only emitted when we actually know it —
 * never guessed, never in the future.
 */
function blogLastmod() {
  const dates = new Map();
  const today = new Date();

  for (const file of fs.readdirSync(BLOG_DIR)) {
    if (!file.endsWith(".md")) continue;
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
    const stamp = (
      raw.match(/^updatedDate:\s*(\S+)/m)?.[1] ??
      raw.match(/^publishDate:\s*(\S+)/m)?.[1]
    )?.replace(/['"]/g, "");
    if (!stamp) continue;

    const date = new Date(stamp);
    if (Number.isNaN(date.valueOf()) || date > today) continue;
    dates.set(`${SITE}/blog/${file.replace(/\.md$/, "")}/`, date);
  }
  return dates;
}

const postDates = blogLastmod();

// https://astro.build/config
export default defineConfig({
  site: "https://event-stories.12f.dk",
  base: "/",
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
        },
      },
    },
    build: {
      // Improve code splitting for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            'framer-motion': ['framer-motion'],
            'swiper': ['swiper'],
          },
        },
      },
    },
  },
  image: {
    // Enable image optimization with sharp
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: false,
      },
    },
  },
  integrations: [
    react(),
    tailwind(),
    sitemap({
      changefreq: "weekly",
      priority: 0.7,
      // /app is a redirect stub. /404 is the error page (also noindex).
      filter: (page) => !page.includes("/app/") && !page.includes("/404"),
      serialize(item) {
        if (item.url === `${SITE}/`) {
          item.priority = 1.0;
          item.changefreq = "weekly";
        }
        if (
          item.url.includes("privacy-policy") ||
          item.url.includes("terms-and-conditions") ||
          item.url.includes("cookies-policy")
        ) {
          item.priority = 0.3;
          item.changefreq = "yearly";
        }

        const lastmod = postDates.get(item.url);
        if (lastmod) {
          item.lastmod = lastmod.toISOString();
        } else if (item.url === `${SITE}/blog/` && postDates.size > 0) {
          // The index changes when its newest post does.
          item.lastmod = new Date(
            Math.max(...[...postDates.values()].map((d) => d.valueOf())),
          ).toISOString();
        }
        return item;
      },
    }),
  ],
});
