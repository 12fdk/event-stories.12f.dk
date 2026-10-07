import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = (await getCollection("blog", ({ data }) => !data.draft)).sort(
    (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime(),
  );

  return rss({
    title: "Event Stories Blog — Party & Wedding Planning Guides",
    description:
      "Practical guides for private hosts planning parties, weddings, and other celebrations.",
    site: context.site ?? "https://event-stories.12f.dk",
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: `/blog/${post.slug}/`,
      // RSS 2.0 author is an email. The name in parentheses is the byline.
      author: `robert@12f.dk (${post.data.author})`,
      categories: [post.data.keyword, ...post.data.tags],
    })),
    customData: `<language>en</language>`,
  });
}
