/**
 * Blog App Store CTAs: topic-aware copy and the mid-article placement rule.
 *
 * Shared by the rehype plugin that renders the mid-article CTA
 * (src/plugins/rehype-inline-cta.mjs) and the post template's end CTA. Plain
 * .mjs on purpose so the rule stays Node-readable without a TypeScript step.
 *
 * The subtle-promotion rule (prompt.md) is "mention the app once or twice at
 * most" in the body, plus the standard end CTA. The mid-article CTA lives
 * inside that budget, never on top of it:
 *
 *   - "upgrade": the post already has a mention in a mid-article section.
 *     That paragraph is *re-rendered* as the CTA card — same words, plus an
 *     App Store button. Mention count unchanged.
 *   - "insert": the post's only mention sits in its closing section (or in
 *     the frontmatter). A short topic-aware card is added after the section
 *     nearest the middle of the article. It counts as a mention, so this
 *     only happens when the body prose has at most one.
 *   - "none": neither fits. Nothing is added; the end CTA still renders.
 *
 * Frontmatter knobs (all optional):
 *   inlineCta: false        — no mid-article CTA on this post
 *   inlineCtaAfter: "…"     — insert after the H2 whose text contains this
 *   inlineCtaText: "…"      — custom sentence for an inserted card
 */

/** Umami event name for the mid-article card (carries the post slug). */
export const INLINE_SURFACE = "blog-inline-cta";
/** Umami event name for the end-of-article box. */
export const END_SURFACE = "blog-cta-end";

/**
 * Copy per topic. Every claim matches the App Store listing: guest list with
 * RSVPs, budget with running total, schedule, reminders, vendor details,
 * PDF report, offline, free with a one-time premium upgrade. The `inline`
 * and `end` sentences differ on purpose — they must not repeat each other.
 */
export const TOPICS = {
  wedding: {
    label: "Planning the wedding",
    inline:
      "If you'd rather not juggle the group chat, the spreadsheet, and 47 conversations, Event Stories keeps the guest list, budget, and timeline on the wedding — with a reminder when each phase is due.",
    end: "A wedding breaks the person who keeps it in their head. Event Stories keeps the guests, the budget, the vendors, and the timeline on the event itself — free on the App Store, no account.",
  },
  budget: {
    label: "Keeping the budget",
    inline:
      "If you'd rather not track event costs in a spreadsheet, Event Stories logs each payment against the budget, with a running total of what is left.",
    end: "Event budgets slip a vendor at a time. Event Stories keeps the running total on one screen, so an overrun shows up while you can still act on it — free on the App Store.",
  },
  food: {
    label: "Feeding the party",
    inline:
      "If you'd rather not guess portions from memory, Event Stories keeps the headcount and the per-person amounts next to the order, so the numbers match on the day.",
    end: "Ordering food for a party is math with consequences. Event Stories keeps the headcount and the per-person amounts on the event, so the order matches the guests — free on the App Store.",
  },
  guests: {
    label: "Knowing who is coming",
    inline:
      "If you'd rather not track RSVPs in a notes app, Event Stories keeps the guest list, who confirmed, and who still needs chasing in one place.",
    end: "Half of party stress is not knowing who is actually coming. Event Stories keeps the guest list and the RSVPs on the event, so the numbers are live — free on the App Store.",
  },
  general: {
    label: "One place for the event",
    inline:
      "If you'd rather not juggle a notes app, a spreadsheet, and the group chat, Event Stories keeps the guests, the budget, and the schedule of the event in one offline iPhone app.",
    end: "Most party stress comes from information scattered across the group chat, the spreadsheet, and your head. Event Stories keeps the guests, budget, and schedule on the event — free on the App Store, no account.",
  },
};

/** Pick a topic from slug, keyword and tags. Order matters: most specific first.
 *  Budget outranks wedding on purpose: a "wedding under 10k" or "cost per
 *  guest" post is a budget post that happens to be about a wedding. */
export function topicFor({ slug = "", keyword = "", tags = [] } = {}) {
  const hay = [slug, keyword, ...(Array.isArray(tags) ? tags : [])].join(" ").toLowerCase();
  if (/budget|cost|expense|money|price|afford|per person/.test(hay)) return "budget";
  if (/food|catering|portion|menu|drink|feast/.test(hay)) return "food";
  if (/guest|rsvp|headcount|seating|no.show|reception/.test(hay)) return "guests";
  if (/wedding|marriage/.test(hay)) return "wedding";
  return "general";
}

/** Section headings that are wrap-ups, sources or FAQs — never a mid-article spot. */
const CLOSING = /sources|further reading|wrapping up|bottom line|summary|ready to|putting it together|what's next|frequently asked|\bfaq\b|in short|final thoughts|honest recommendation/i;

/**
 * Decide the mid-article CTA for one post.
 *
 * @param {object} p
 * @param {{heading: string, words: number, mentions: number}[]} p.sections
 *   index 0 = intro before the first H2; then one entry per H2 section.
 *   `mentions` = paragraphs in that section that name Event Stories or link
 *   the App Store.
 * @param {number} p.proseMentions "Event Stories" count in the rendered prose
 * @param {object} p.frontmatter
 * @returns {{mode: "upgrade"|"insert"|"none", section: number, reason: string}}
 */
export function planInlineCta({ sections, proseMentions, frontmatter = {} }) {
  const fm = frontmatter ?? {};
  if (fm.inlineCta === false || fm.inlineCta === "false") {
    return { mode: "none", section: -1, reason: "disabled in frontmatter" };
  }
  // The last section that is not Sources/FAQ is the closing one; a mention in
  // it is the closing nudge and sits right above the end CTA box anyway.
  const content = sections
    .map((s, i) => ({ ...s, i }))
    .filter((s) => s.i > 0 && !/sources|further reading|frequently asked|\bfaq\b/i.test(s.heading));
  const lastContent = content.length ? content[content.length - 1].i : -1;
  const eligible = (s) => s.i >= 1 && s.i !== lastContent && !CLOSING.test(s.heading);

  // 1. Upgrade an existing mid-article mention (no change to the count).
  const withMention = content.find((s) => eligible(s) && s.mentions > 0);
  if (withMention && !fm.inlineCtaAfter) {
    return { mode: "upgrade", section: withMention.i, reason: `upgrades the mention in "${withMention.heading}"` };
  }

  // 2. Insert a card — only if it keeps the body at ≤ 2 mentions.
  if (proseMentions > 1) {
    return {
      mode: "none",
      section: -1,
      reason: fm.inlineCtaAfter
        ? `inlineCtaAfter is set but the body already has ${proseMentions} mentions`
        : `body already has ${proseMentions} mentions, none mid-article`,
    };
  }
  if (fm.inlineCtaAfter) {
    const needle = String(fm.inlineCtaAfter).toLowerCase();
    const hit = content.find((s) => s.heading.toLowerCase().includes(needle));
    if (!hit) return { mode: "none", section: -1, reason: `inlineCtaAfter "${fm.inlineCtaAfter}" matches no H2` };
    return { mode: "insert", section: hit.i, reason: `inserted after "${hit.heading}" (frontmatter)` };
  }
  const total = sections.reduce((n, s) => n + s.words, 0);
  let run = 0;
  let best = null;
  sections.forEach((s, i) => {
    run += s.words;
    const at = run / (total || 1);
    // At least two sections in and past 30% — the reader has had real value
    // before anything asks for their attention — and not in the last 20%.
    if (i < 2 || at < 0.3 || at > 0.8 || !eligible({ ...s, i })) return;
    const d = Math.abs(at - 0.5);
    if (!best || d < best.d) best = { i, d, heading: s.heading };
  });
  if (!best) return { mode: "none", section: -1, reason: "no section between 30% and 80% of the article" };
  return { mode: "insert", section: best.i, reason: `inserted after "${best.heading}"` };
}
