"""Tests for tools/reddit-topics.py. Stdlib only, no network.

    make test        # or: python3 -m unittest discover -s tools -p 'test_*.py'
"""

from __future__ import annotations

import importlib.util
import tempfile
import unittest
from pathlib import Path

_SPEC = importlib.util.spec_from_file_location(
    "reddit_topics", Path(__file__).resolve().parent / "reddit-topics.py")
rt = importlib.util.module_from_spec(_SPEC)
_SPEC.loader.exec_module(rt)

FEED = """<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <entry><title>How do I   chase RSVPs without being rude?</title></entry>
  <entry><title>WE DID IT!!! Photos from our day</title></entry>
</feed>"""


class ThemeMatching(unittest.TestCase):
    def test_seating_question(self):
        self.assertIn("seating", rt.themes_of("How do you do a seating chart for 120 guests?"))

    def test_rsvp_and_guest_list_together(self):
        got = rt.themes_of("Guests haven't responded and I need a final count — plus one etiquette?")
        self.assertIn("rsvp", got)
        self.assertIn("guest-list", got)

    def test_food_quantities(self):
        self.assertIn("food-drink", rt.themes_of("How much food per person for a backyard grad party?"))

    def test_short_words_need_word_boundaries(self):
        # "mil" must not fire inside "family", "host" is not a keyword at all.
        self.assertNotIn("family-politics", rt.themes_of("Planning a family dinner in a hostel"))
        self.assertIn("family-politics", rt.themes_of("My MIL wants to invite 40 people"))

    def test_tips_is_not_vendor_tipping(self):
        self.assertNotIn("vendor-costs", rt.themes_of("Any tips for a first birthday party?"))
        self.assertIn("vendor-costs", rt.themes_of("How much to tip the DJ and caterer?"))

    def test_smart_quotes_are_normalised(self):
        self.assertIn("rsvp", rt.themes_of("Guests didn’t reply by the deadline"))

    def test_cost_per_guest_is_budget_not_food(self):
        got = rt.themes_of("How Much Does a Wedding Cost Per Guest in 2026?")
        self.assertIn("budget", got)
        self.assertNotIn("food-drink", got)


class Usefulness(unittest.TestCase):
    def test_real_question_is_useful(self):
        self.assertTrue(rt.is_useful("How far in advance should we send save the dates?"))

    def test_celebration_post_is_noise(self):
        self.assertFalse(rt.is_useful("We did it! Here are some photos from our wedding"))

    def test_venting_is_noise(self):
        self.assertFalse(rt.is_useful("Rant: why do people never RSVP on time?"))

    def test_tag_question_is_noise(self):
        self.assertFalse(rt.is_useful("Open bars are worth every penny, right?"))

    def test_all_caps_is_noise(self):
        self.assertFalse(rt.is_useful("HOW IS EVERYONE AFFORDING THESE VENUES"))

    def test_too_short(self):
        self.assertFalse(rt.is_useful("Help?"))

    def test_word_inside_word_is_not_noise(self):
        # "rant" must not kill a title about restaurants.
        self.assertTrue(rt.is_useful("How do I book restaurants for a rehearsal dinner?"))


class Feeds(unittest.TestCase):
    def test_titles_from_atom(self):
        self.assertEqual(rt.titles_from(FEED)[0], "How do I chase RSVPs without being rude?")
        self.assertEqual(len(rt.titles_from(FEED)), 2)

    def test_broken_xml_gives_nothing(self):
        self.assertEqual(rt.titles_from("<feed"), [])


class Coverage(unittest.TestCase):
    def _post(self, d: Path, slug: str, title: str, keyword: str, tags: str = "") -> None:
        (d / f"{slug}.md").write_text(
            f'---\ntitle: "{title}"\nkeyword: "{keyword}"\ntags: [{tags}]\n---\n\nBody text.\n',
            encoding="utf-8")

    def test_title_and_keyword_mark_a_theme_covered(self):
        with tempfile.TemporaryDirectory() as tmp:
            d = Path(tmp)
            self._post(d, "wedding-seating-chart", "How to Make a Wedding Seating Chart",
                       "how to make a wedding seating chart")
            self.assertEqual(rt.covered_themes(d), {"seating": ["wedding-seating-chart"]})

    def test_tags_and_body_do_not_count(self):
        with tempfile.TemporaryDirectory() as tmp:
            d = Path(tmp)
            self._post(d, "table-programs", "Wedding Table Programs", "wedding table programs",
                       tags='"guest list", "budget"')
            self.assertEqual(rt.covered_themes(d), {})

    def test_missing_dir_is_empty(self):
        self.assertEqual(rt.covered_themes(Path("/nonexistent/posts")), {})

    def test_real_posts_cover_the_obvious_themes(self):
        covered = rt.covered_themes()
        for key in ("seating", "rsvp", "budget", "baby-shower"):
            self.assertIn(key, covered)


class Ranking(unittest.TestCase):
    def test_higher_in_top_ranks_first_and_covered_is_flagged(self):
        entries = [
            ("How do I chase RSVPs from family?", "Etiquette", 0),
            ("Best seating chart method?", "weddingplanning", 20),
            ("Seating chart help, divorced parents", "weddingplanning", 22),
        ]
        ranked = rt.rank_themes(entries, {"seating": ["wedding-seating-chart"]}, examples=3)
        self.assertEqual(ranked[0]["key"], "rsvp")
        seating = next(b for b in ranked if b["key"] == "seating")
        self.assertEqual(seating["count"], 2)
        self.assertEqual(seating["covered_by"], ["wedding-seating-chart"])

    def test_example_count_is_capped(self):
        entries = [(f"How do I plan the seating chart number {i}?", "x", i) for i in range(10)]
        ranked = rt.rank_themes(entries, {}, examples=2)
        self.assertEqual(len(ranked[0]["titles"]), 2)


if __name__ == "__main__":
    unittest.main()
