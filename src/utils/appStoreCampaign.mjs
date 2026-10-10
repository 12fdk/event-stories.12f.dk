/**
 * App Store campaign links.
 *
 * Apple fills the App Store Connect Campaign column from `ct` (max 40
 * characters). `mt=8` selects the iOS storefront. Do not add `pt=` unless a
 * link already carries a provider token.
 *
 *   homepage / site chrome  site-event-stories
 *   a blog post             blog-<post-slug>   (truncated to 40)
 *   llms.txt / ai.txt       llms-event-stories
 */

export const APP_ID = "6755695151";
export const CT_MAX = 40;

export const SITE_TOKEN = "site-event-stories";
export const LLMS_TOKEN = "llms-event-stories";

/** Truncate a campaign token to Apple's 40-character `ct` limit. */
export function campaignToken(token) {
  return String(token ?? "").slice(0, CT_MAX);
}

/**
 * `https://apps.apple.com/app/id6755695151?ct=<token>&mt=8`
 *
 * When `preservePtFrom` is an existing App Store URL that already has `pt`,
 * that provider token is copied across. It is never invented.
 */
export function campaignUrl(token, { preservePtFrom } = {}) {
  const url = new URL(`https://apps.apple.com/app/id${APP_ID}`);
  url.searchParams.set("ct", campaignToken(token));
  if (preservePtFrom) {
    try {
      const pt = new URL(String(preservePtFrom), "https://apps.apple.com").searchParams.get("pt");
      if (pt) url.searchParams.set("pt", pt);
    } catch {
      // Not a URL. Leave pt off.
    }
  }
  url.searchParams.set("mt", "8");
  return url.toString();
}

export const SITE_APP_STORE_URL = campaignUrl(SITE_TOKEN);
export const LLMS_APP_STORE_URL = campaignUrl(LLMS_TOKEN);

/** `blog-<slug>`, truncated to 40 characters. */
export function blogCampaignToken(slug) {
  const clean = String(slug ?? "")
    .replace(/\.mdx?$/, "")
    .replace(/^\/+|\/+$/g, "");
  return campaignToken(`blog-${clean}`);
}

export function blogCampaignUrl(slug, options) {
  return campaignUrl(blogCampaignToken(slug), options);
}
