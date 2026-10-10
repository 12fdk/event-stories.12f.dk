import { blogCampaignUrl } from "../utils/appStoreCampaign.mjs";
import { TOPICS, planInlineCta, topicFor } from "../utils/blogCta.mjs";

/**
 * Mid-article App Store CTA for blog posts.
 *
 * Posts are plain Markdown, so a component cannot be dropped into them by
 * hand. This plugin finds the right spot from the post's own structure (see
 * planInlineCta in src/utils/blogCta.mjs for the rule and the mention budget)
 * and renders a quiet card there:
 *
 *   small label · one sentence · "Get the app" button
 *
 * The card and any upgraded prose link carry the blog CTA event name with the
 * post slug (`blog-inline-cta-<slug>`), mirroring the end-of-post box
 * (`blog-cta-end-<slug>`), so Umami reads the two surfaces on separate rows.
 * This site had no blog CTAs before (the tracker loads with no custom event
 * names in use), so these names introduce the same convention the sister
 * 12f blogs use.
 */

const text = (node) =>
  node.type === "text"
    ? node.value
    : (node.children ?? []).map(text).join("");

const hasAppLink = (node) =>
  node.type === "element" &&
  ((node.tagName === "a" &&
    String(node.properties?.href ?? "").includes("apps.apple.com")) ||
    (node.children ?? []).some(hasAppLink));

// A paragraph ending in a colon introduces a list; turning it into a card
// would orphan the list, so it is skipped.
const isMention = (node) =>
  node.type === "element" &&
  node.tagName === "p" &&
  !/:\s*$/.test(text(node)) &&
  (/Event Stories/.test(text(node)) || hasAppLink(node));

const words = (node) => text(node).split(/\s+/).filter(Boolean).length;

/** Tracking attributes for the card button and upgraded prose links. */
function track(slug) {
  return {
    dataUmamiEvent: slug ? `blog-inline-cta-${slug}` : "blog-inline-cta",
  };
}

/** Point every App Store link on this post at its `blog-<slug>` campaign. */
function retagAppStoreLinks(node, slug) {
  if (!node || typeof node !== "object") return;
  if (
    node.type === "element" &&
    node.tagName === "a" &&
    String(node.properties?.href ?? "").includes("apps.apple.com")
  ) {
    node.properties.href = blogCampaignUrl(slug, {
      preservePtFrom: String(node.properties.href),
    });
  }
  (node.children ?? []).forEach((child) => retagAppStoreLinks(child, slug));
}

/** Stamp the tracking attributes onto App Store links inside a paragraph. */
function stampLinks(node, slug) {
  if (node.type !== "element") return;
  if (
    node.tagName === "a" &&
    String(node.properties?.href ?? "").includes("apps.apple.com")
  ) {
    Object.assign(node.properties, track(slug));
  }
  (node.children ?? []).forEach((c) => stampLinks(c, slug));
}

const el = (tagName, properties, children = []) => ({
  type: "element",
  tagName,
  properties,
  children,
});
const t = (value) => ({ type: "text", value });

function card({ label, paragraph, slug }) {
  return el(
    "aside",
    {
      className: [
        "blog-inline-cta",
        "not-prose",
        "my-10",
        "rounded-box",
        "border",
        "border-base-300",
        "bg-base-200/60",
        "p-6",
        "sm:p-7",
      ],
      dataCtaId: slug ? `blog-inline-cta-${slug}` : "blog-inline-cta",
      ariaLabel: "About the Event Stories app",
    },
    [
      el("p", { className: ["mb-2", "text-sm", "font-semibold", "uppercase", "tracking-wide", "text-base-content/50"] }, [t(label)]),
      { ...paragraph, properties: { ...(paragraph.properties ?? {}), className: ["mb-5", "text-base", "text-base-content/80"] } },
      el("div", { className: ["flex", "flex-wrap", "items-center", "gap-x-4", "gap-y-2"] }, [
        el(
          "a",
          {
            href: blogCampaignUrl(slug),
            target: "_blank",
            rel: "noopener",
            className: ["btn", "btn-primary", "normal-case"],
            ...track(slug),
          },
          [t("Get Event Stories — Free")],
        ),
        el("span", { className: ["text-sm", "text-base-content/60"] }, [t("iPhone · works offline · no account")]),
      ]),
    ],
  );
}

export function rehypeInlineCta() {
  return (tree, file) => {
    const fm = file.data?.astro?.frontmatter;
    // Only blog posts: they are the only content with this frontmatter shape.
    if (!fm || !fm.keyword || !String(file.path ?? file.history?.[0] ?? "").includes("content/blog")) return;
    const slug = String(file.path ?? file.history?.[0] ?? "").split("/").pop().replace(/\.mdx?$/, "");
    // Prose links and the inserted button share one campaign token per post.
    retagAppStoreLinks(tree, slug);

    // Group root children into H2 sections, as planInlineCta expects.
    const sections = [{ heading: "", words: 0, mentions: 0, start: 0, nodes: [] }];
    tree.children.forEach((node, idx) => {
      if (node.type === "element" && node.tagName === "h2") {
        sections.push({ heading: text(node).trim(), words: 0, mentions: 0, start: idx, nodes: [] });
        return;
      }
      const s = sections[sections.length - 1];
      s.nodes.push(idx);
      if (node.type === "element") {
        s.words += words(node);
        if (isMention(node)) s.mentions++;
      }
    });
    const proseMentions = (text(tree).match(/Event Stories/g) || []).length;
    const plan = planInlineCta({ sections, proseMentions, frontmatter: fm });
    if (plan.mode === "none") return;

    const topic = TOPICS[topicFor({ slug, keyword: fm.keyword, tags: fm.tags })];
    const section = sections[plan.section];

    if (plan.mode === "upgrade") {
      const idx = section.nodes.find((i) => isMention(tree.children[i]));
      if (idx === undefined) return;
      const paragraph = tree.children[idx];
      stampLinks(paragraph, slug);
      tree.children[idx] = card({ label: topic.label, paragraph, slug });
      return;
    }

    // insert: after the last node of the chosen section, i.e. before the next H2.
    const after = section.nodes.length ? section.nodes[section.nodes.length - 1] : section.start;
    const sentence = fm.inlineCtaText || topic.inline;
    tree.children.splice(after + 1, 0, card({ label: topic.label, paragraph: el("p", {}, [t(sentence)]), slug }));
  };
}

export default rehypeInlineCta;
