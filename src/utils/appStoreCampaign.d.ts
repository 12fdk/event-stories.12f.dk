export const APP_ID: string;
export const CT_MAX: number;
export const SITE_TOKEN: string;
export const LLMS_TOKEN: string;
export function campaignToken(token: string): string;
export function campaignUrl(
  token: string,
  options?: { preservePtFrom?: string },
): string;
export const SITE_APP_STORE_URL: string;
export const LLMS_APP_STORE_URL: string;
export function blogCampaignToken(slug: string): string;
export function blogCampaignUrl(
  slug: string,
  options?: { preservePtFrom?: string },
): string;
