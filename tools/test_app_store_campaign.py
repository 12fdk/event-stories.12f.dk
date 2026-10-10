"""Campaign tokens on App Store links. Stdlib plus the Node helper.

    make test
"""

from __future__ import annotations

import json
import subprocess
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HELPER = ROOT / "src" / "utils" / "appStoreCampaign.mjs"

NODE = r"""
import {
  CT_MAX,
  SITE_APP_STORE_URL,
  LLMS_APP_STORE_URL,
  blogCampaignToken,
  blogCampaignUrl,
  campaignUrl,
} from "./src/utils/appStoreCampaign.mjs";

const long = "a".repeat(80);
const withPt = campaignUrl("site-event-stories", {
  preservePtFrom: "https://apps.apple.com/app/id6755695151?pt=12345",
});
const withoutPt = campaignUrl("site-event-stories", {
  preservePtFrom: "https://apps.apple.com/dk/app/event-stories-party-planner/id6755695151",
});
process.stdout.write(JSON.stringify({
  max: CT_MAX,
  site: SITE_APP_STORE_URL,
  llms: LLMS_APP_STORE_URL,
  shortToken: blogCampaignToken("dinner-party-timeline"),
  shortUrl: blogCampaignUrl("dinner-party-timeline.md"),
  longToken: blogCampaignToken(long),
  withPt,
  withoutPt,
}));
"""


class AppStoreCampaign(unittest.TestCase):
    def setUp(self):
        proc = subprocess.run(
            ["node", "--input-type=module", "-e", NODE],
            cwd=ROOT,
            check=True,
            capture_output=True,
            text=True,
        )
        self.data = json.loads(proc.stdout)

    def test_site_and_llms_links(self):
        self.assertEqual(
            self.data["site"],
            "https://apps.apple.com/app/id6755695151?ct=site-event-stories&mt=8",
        )
        self.assertEqual(
            self.data["llms"],
            "https://apps.apple.com/app/id6755695151?ct=llms-event-stories&mt=8",
        )
        self.assertNotIn("pt=", self.data["site"])
        self.assertNotIn("pt=", self.data["llms"])

    def test_blog_token_uses_slug_and_strips_extension(self):
        self.assertEqual(self.data["shortToken"], "blog-dinner-party-timeline")
        self.assertEqual(
            self.data["shortUrl"],
            "https://apps.apple.com/app/id6755695151?ct=blog-dinner-party-timeline&mt=8",
        )

    def test_blog_token_truncates_to_40(self):
        token = self.data["longToken"]
        self.assertEqual(len(token), self.data["max"])
        self.assertTrue(token.startswith("blog-"))
        self.assertLessEqual(len(token), 40)

    def test_provider_token_is_kept_only_when_already_present(self):
        self.assertIn("pt=12345", self.data["withPt"])
        self.assertIn("ct=site-event-stories", self.data["withPt"])
        self.assertNotIn("pt=", self.data["withoutPt"])


if __name__ == "__main__":
    unittest.main()
