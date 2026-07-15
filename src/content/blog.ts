export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  image?: string;
  tags: string[];
  readingTime: number;
  author: string;
}

export const blogPosts: BlogPostMeta[] = [
  {
    slug: "ultimate-event-budget-guide",
    title: "The Ultimate Guide to Event Budgets: How to Plan Without Stress",
    description:
      "A step-by-step guide to creating an event budget that actually works — from the first number you write down to the last receipt you file.",
    date: "2026-01-10",
    tags: ["budgeting", "planning", "guide"],
    readingTime: 8,
    author: "Robert Jensen",
  },
];

// Map of slug -> markdown content file path
// In production, these would be read from src/content/blog/{slug}.md
// For now, we reference them; the actual content lives in .md files
export const blogPostPaths: Record<string, string> = {
  "ultimate-event-budget-guide": "ultimate-event-budget-guide.mdx",
};