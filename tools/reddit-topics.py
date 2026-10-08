#!/usr/bin/env python3
"""reddit-topics.py — what people planning a wedding, a birthday, a baby shower
or a dinner party are actually asking about: guest lists, RSVPs, seating,
budgets, food quantities, timelines and the family politics around all of it.

Feeds the weekly blog job (see prompt.md §2) with real reader demand instead of
whatever the model imagines a host worries about.

    python3 tools/reddit-topics.py                 # ranked digest, ~60 lines
    python3 tools/reddit-topics.py --json          # same data, machine-readable
    python3 tools/reddit-topics.py --refresh       # ignore the cache
    python3 tools/reddit-topics.py --windows month,year --max-seconds 1800

A failed scrape is a normal outcome, not a bug: prompt.md §2 falls back to the
ranked topic bank.

Ported from bike-stories.12f.dk/tools/reddit-topics.py; the fetching, pacing,
caching and matching are the same, the subreddits and themes are this site's.

WHY RSS AND NOT THE JSON API: reddit.com/r/<sub>/top.json returns 403 to both a
datacenter IP and a home IP now. The Atom feed at /r/<sub>/top/.rss is still
served, so that is what this uses. It is rate-limited though — measured
2026-08-27, an anonymous request comes back with x-ratelimit-remaining 0 and a
~54s reset, so the real budget is about one feed a minute. That is why requests
are paced at 50s, retried with backoff, and cached to .cache/ for a day. The
600s budget therefore buys the first ~11 subreddits, which is what SUBREDDITS
is ordered for.

WHY A SCRIPT AND NOT A FEW CURL COMMANDS IN THE BRIEF: the Hermes agent's
terminal blocks `-c` / `-e` flags, so `python3 -c '...'` and clever one-liners
fail at runtime with BLOCKED. And raw feeds are ~50 KB each — a dozen of them
would bury the model's context. A plain command that prints a small digest
survives both constraints.

Failure is not fatal: if every feed fails, this exits 2 having printed a clear
message, and the brief falls back to the ranked topic bank in prompt.md.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / ".cache" / "reddit-topics"
POSTS = ROOT / "src" / "content" / "blog"

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36")
ATOM = {"a": "http://www.w3.org/2005/Atom"}

# ORDER MATTERS. At ~one feed a minute the 600s budget reaches roughly the first
# 11 subs, so this is a priority list, highest-value first. r/weddingplanning is
# the single best fit — it is nothing but hosts asking how to do the logistics —
# then the budget-wedding and general party-planning subs, then r/Etiquette,
# where RSVP, plus-one and guest-list questions live. The parenting subs at the
# end are where first-birthday and kids'-party questions surface; their /top is
# mostly other things, so they are the ones we can afford to lose.
SUBREDDITS = [
    "weddingplanning", "Weddingsunder10k", "partyplanning", "Etiquette",
    "EventPlanning", "babyshowers", "wedding", "Weddings",
    "beyondthebump", "Mommit", "Parenting",
]
# Month only by default: one window over the priority list fits the budget.
# Pass --windows month,year by hand for the deeper corpus when you can wait.
WINDOWS = ["month"]

# Theme buckets. A title can land in several; each is counted once per theme.
# Keep these lowercase. Short words match on word boundaries (see _matches),
# phrases and long words as substrings. Every theme maps to something a host
# does with the app's real features (guest list, RSVP, budget, seating,
# timeline, checklist, wish list, PDF, sharing) — or is a celebration type.
THEMES: dict[str, tuple[str, list[str]]] = {
    "seating": ("Seating charts, table plans and who sits where", [
        "seating chart", "seating plan", "table plan", "assigned seating",
        "open seating", "table assignment", "sweetheart table", "head table",
        "kids table", "where to seat", "who to seat", "seat my", "seating"]),
    "rsvp": ("RSVPs: chasing replies, deadlines, no-shows and headcount", [
        "rsvp", "didn't reply", "didnt reply", "haven't responded", "havent responded",
        "no show", "no-show", "headcount", "head count", "final count",
        "didn't respond", "didnt respond", "not responding"]),
    "guest-list": ("Building and cutting the guest list, plus-ones and kids", [
        "guest list", "guestlist", "plus one", "plus-one", "+1", "cut the list",
        "not inviting", "not invite", "uninvite", "who to invite", "b list", "b-list",
        "child free", "child-free", "childfree", "no kids", "invite coworkers",
        "how many guests", "guest count"]),
    "budget": ("Budgets: what to spend, where it goes, staying on track", [
        "budget", "how much did you spend", "how much should", "cost breakdown",
        "afford", "overspent", "over budget", "spend on", "spent on",
        "save money", "cheap", "frugal", "expensive", "cost per guest",
        "how much does", "under 10k", "under $10k"]),
    "vendor-costs": ("Vendors: quotes, deposits, tipping and what to pay", [
        "vendor", "vendors", "quote", "quoted", "deposit", "caterer", "catering cost",
        "photographer", "dj", "florist", "tipping", "how much to tip", "contract",
        "invoice"]),
    "food-drink": ("How much food and drink per guest", [
        "how much food", "how many drinks",
        "food per person", "food per guest", "drinks per", "how much alcohol",
        "how much wine", "open bar", "dry wedding",
        "appetizers", "appetisers", "buffet", "potluck", "menu", "catering",
        "cake", "dessert"]),
    "timeline": ("Timelines and the run of show for the day", [
        "timeline", "schedule", "run of show", "order of events", "day-of timeline",
        "day of timeline", "what time", "itinerary", "how long should", "how long is",
        "start time", "end time", "reception timeline"]),
    "getting-started": ("Where to start: checklists for overwhelmed first-timers", [
        "where to start", "where do i start", "checklist", "just engaged",
        "first steps", "overwhelmed", "to do list", "to-do list", "planning tips",
        "first time planning", "how far in advance", "how early", "months out"]),
    "baby-shower": ("Baby showers and sprinkles", [
        "baby shower", "babyshower", "sprinkle", "gender reveal", "sip and see",
        "diaper party", "shower games", "host my shower", "shower for"]),
    "kids-birthday": ("Kids' birthdays, first birthdays and party logistics", [
        "first birthday", "1st birthday", "kids party", "kid's party", "kids birthday",
        "kid's birthday", "toddler party", "birthday party", "goodie bag",
        "goody bag", "party favors", "party favours", "bounce house", "drop off party"]),
    "milestone": ("Milestone and surprise parties: 30th to retirement", [
        "surprise party", "30th", "40th", "50th", "60th", "70th", "milestone birthday",
        "retirement party", "anniversary party", "graduation party", "grad party",
        "engagement party", "going away party", "housewarming"]),
    "hosting": ("Hosting at home: dinner parties and holiday gatherings", [
        "dinner party", "hosting", "friendsgiving", "thanksgiving",
        "christmas dinner", "holiday party", "family reunion", "game night",
        "brunch", "bbq", "cookout"]),
    "registry": ("Registries, wish lists and gift etiquette", [
        "registry", "wish list", "wishlist", "gift", "gifts", "cash fund",
        "honeymoon fund", "no gifts", "gift card", "thank you card", "thank-you card"]),
    "family-politics": ("Family politics: parents, in-laws and who pays", [
        "mother in law", "mother-in-law", "mil", "in-laws", "in laws", "my parents",
        "my mom", "my dad", "divorced parents", "parents paying", "who pays",
        "family drama", "future mil", "fmil", "step mom", "stepmom"]),
    "invitations": ("Invitations, save-the-dates and the wording", [
        "invitation", "invitations", "invite wording", "save the date",
        "save-the-date", "evite", "paperless", "wording", "when to send"]),
    "organising": ("Keeping it all organised: spreadsheets, apps and sharing", [
        "spreadsheet", "google sheet", "google sheets", "excel", "keep track",
        "how do you track", "organize", "organise", "organized", "organised",
        "planning app", "app for", "binder", "notion", "trello"]),
    "help-delegating": ("Splitting the work: partners, helpers, day-of coordinators", [
        "not helping", "doesn't help", "doesnt help", "delegate", "day of coordinator",
        "day-of coordinator", "coordinator", "planner worth", "wedding planner",
        "split the work", "doing everything", "mental load", "help me plan"]),
    "venue": ("Venues, backyard parties and the rain plan", [
        "venue", "backyard", "outdoor", "rain plan", "tent", "at home wedding",
        "courthouse", "elopement", "micro wedding", "small wedding"]),
}

# Titles that are photos, brag-posts, celebrations or venting. Wedding subs'
# /top is dominated by "WE DID IT" pictures and dress reveals: no query intent.
NOISE = [
    "haha", "lol", "lmao", "meme", "rate my", "my setup", "look what", "found this",
    "haul", "unboxing", "day in the life", "psa:", "just wanted to share",
    "guess the", "who else", "relatable", "me when", "pov", "before and after",
    "update:", "photo dump", "pics from", "pictures from", "photos from",
    "look at this", "[oc]", "album", "sunset",
    # Celebration and reveal posts: they carry "wedding" but ask nothing.
    "we did it", "we're married", "were married", "just married", "we got married",
    "i got married", "officially married", "married!", "our wedding photos",
    "my dress", "the dress", "dress reveal", "final dress", "said yes",
    "i said yes", "she said yes", "we're engaged", "just got engaged!",
    "throwback", "recap", "highlights",
    # Rhetorical and venting posts. These carry a "?" or a question word, so
    # is_useful() would wave them through. They are discourse, not queries.
    "is it just me", "am i the only", "anyone else feel", "does anyone else feel",
    "my favourite part", "my favorite part",
    "rant", "vent", "venting", "unpopular opinion", "am i wrong", "aita", "wibta",
    ", right?", "why do people", "so tired of", "i'm done with", "im done with",
    "the audacity", "you won't believe", "you wont believe", "shaming",
    # Seen on the first live run (2026-10-08): community meta-posts and
    # cautionary tales that a "how" or "why" sneaks past is_useful().
    "petition", "this is why", "reminder that", "mod post", "weekly thread",
]

# Rhetorical tag questions ending a title — "…, right?", "…, isn't it?". These
# are agreement-fishing, not queries.
TAG_QUESTION = re.compile(
    r"\b(right|isn'?t it|aren'?t they|am i wrong|or is it just me)\s*[?!]+\s*$")
QUESTION_WORDS = [
    "how", "what", "why", "when", "which", "anyone", "does", "do you", "should",
    "tips", "advice", "help", "is it", "can i", "any way", "best way", "struggl",
    "cant", "can't", "trouble", "problem", "recommend", "worth", " vs ", "ideas",
    "need", "normal", "okay to", "ok to", "rude",
]


def cache_path(sub: str, window: str) -> Path:
    return CACHE / f"{sub}-{window}.xml"


def read_cache(path: Path) -> str | None:
    try:
        return path.read_text(encoding="utf-8")
    except OSError:
        return None


def save_cache(path: Path, body: str, verbose: bool) -> None:
    """Best effort. A read-only checkout must not cost us a fetched feed."""
    try:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(body, encoding="utf-8")
    except OSError as e:
        if verbose:
            print(f"  (cache not written: {e.__class__.__name__})", file=sys.stderr)


def fetch(sub: str, window: str, pace: float, ttl: int, refresh: bool,
          verbose: bool, deadline: float) -> tuple[str | None, bool]:
    """Return (xml, from_cache). None means this feed is unavailable.

    Reddit rate-limits anonymous RSS hard — 429 is the normal response to any
    enthusiasm — so requests are paced, backed off, and finally given up on.
    Progress goes to stderr on every feed: a scheduled run is killed after 600s
    of silence, and the backoffs alone can exceed that.
    """
    path = cache_path(sub, window)
    if not refresh and path.exists() and (time.time() - path.stat().st_mtime) < ttl:
        cached = read_cache(path)
        if cached:
            if verbose:
                print(f"  r/{sub:<16} [{window}] cached", file=sys.stderr)
            return cached, True

    url = f"https://www.reddit.com/r/{sub}/top/.rss?t={window}"
    for attempt in range(4):
        if time.time() > deadline:
            if verbose:
                print(f"  r/{sub:<16} [{window}] skipped (time budget spent)", file=sys.stderr)
            break
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA,
                                                       "Accept": "application/atom+xml"})
            with urllib.request.urlopen(req, timeout=25) as r:
                body = r.read().decode("utf-8", "replace")
            save_cache(path, body, verbose)
            if verbose:
                print(f"  r/{sub:<16} [{window}] ok", file=sys.stderr)
            time.sleep(pace)
            return body, False
        except urllib.error.HTTPError as e:
            if e.code in (429, 503) and attempt < 3:
                wait = 30 * (attempt + 1)
                if verbose:
                    print(f"  r/{sub:<16} [{window}] {e.code} — waiting {wait}s",
                          file=sys.stderr)
                time.sleep(min(wait, max(0.0, deadline - time.time())))
                continue
            if verbose:
                print(f"  r/{sub:<16} [{window}] unavailable (HTTP {e.code})", file=sys.stderr)
            break
        except Exception as e:                                    # network, DNS, timeout
            if verbose:
                print(f"  r/{sub:<16} [{window}] unavailable ({type(e).__name__})",
                      file=sys.stderr)
            break

    stale = read_cache(path) if path.exists() else None            # stale beats nothing
    if stale:
        if verbose:
            print(f"  r/{sub:<16} [{window}] using stale cache", file=sys.stderr)
        return stale, True
    return None, False


def titles_from(xml: str) -> list[str]:
    try:
        root = ET.fromstring(xml)
    except ET.ParseError:
        return []
    out = []
    for entry in root.findall("a:entry", ATOM):
        node = entry.find("a:title", ATOM)
        if node is not None and node.text:
            out.append(re.sub(r"\s+", " ", node.text).strip())
    return out


# Reddit titles are full of smart punctuation. Normalise it before matching, or
# a pattern like ", right?" misses «Being "Abused," Right?» purely on quote style.
_SMART = str.maketrans({"‘": "'", "’": "'", "“": '"', "”": '"',
                        "–": "-", "—": "-", "…": "..."})


def normalise(title: str) -> str:
    return title.translate(_SMART)


def is_useful(title: str) -> bool:
    low = f" {normalise(title).lower()} "
    if len(title) < 20:
        return False
    if any(_matches(n, low) for n in NOISE):
        return False
    if TAG_QUESTION.search(low):
        return False
    # All-caps celebration and venting posts carry no query intent.
    if sum(c.isupper() for c in title) > len(title) * 0.6:
        return False
    return any(_matches(w, low) for w in QUESTION_WORDS) or "?" in title


# Short keywords must match on word boundaries, with an optional plural "s".
# Plain substring matching puts "family" under "mil" and "hostel" under "host";
# multi-word phrases and long words stay substring matches, since those are
# specific enough on their own.
_BOUNDARY_CACHE: dict[str, re.Pattern] = {}


def _matches(word: str, low: str) -> bool:
    if " " in word or len(word) > 9:
        return word in low
    pat = _BOUNDARY_CACHE.get(word)
    if pat is None:
        pat = _BOUNDARY_CACHE[word] = re.compile(rf"(?<![a-z]){re.escape(word)}s?(?![a-z])")
    return bool(pat.search(low))


def themes_of(title: str) -> list[str]:
    low = f" {normalise(title).lower()} "
    return [key for key, (_, words) in THEMES.items()
            if any(_matches(w, low) for w in words)]


def _frontmatter_subject(text: str) -> str:
    """The title and keyword of a post — what the post is ABOUT.

    Tags and the body are ignored on purpose: a budget post that mentions the
    guest list in passing is not a post about cutting the guest list.
    """
    if not text.startswith("---"):
        return ""
    head = text[3:6000].split("\n---", 1)[0]
    parts = []
    for line in head.split("\n"):
        key, sep, value = line.partition(":")
        if sep and key.strip() in ("title", "keyword"):
            parts.append(value.strip().strip('"\''))
    return " ".join(parts)


def covered_themes(posts_dir: Path = POSTS) -> dict[str, list[str]]:
    """Map theme -> [slugs] for themes an existing post already addresses."""
    out: dict[str, list[str]] = {}
    if not posts_dir.is_dir():
        return out
    for path in sorted(list(posts_dir.glob("*.md")) + list(posts_dir.glob("*.mdx"))):
        subject = _frontmatter_subject(path.read_text(encoding="utf-8"))
        for key in themes_of(f"{subject} {path.stem.replace('-', ' ')}"):
            out.setdefault(key, []).append(path.stem)
    return out


def rank_themes(entries: list[tuple[str, str, int]], covered: dict[str, list[str]],
                examples: int) -> list[dict]:
    """Bucket useful titles into themes, strongest demand first."""
    buckets: dict[str, dict] = {}
    for title, sub, rank in entries:
        for key in themes_of(title):
            b = buckets.setdefault(key, {"key": key, "label": THEMES[key][0],
                                         "count": 0, "weight": 0.0,
                                         "titles": [], "covered_by": covered.get(key, [])})
            b["count"] += 1
            b["weight"] += 1.0 / (rank + 3)           # higher in /top = stronger demand
            b["titles"].append(title)

    ranked = sorted(buckets.values(), key=lambda b: (b["weight"], b["count"]), reverse=True)
    for b in ranked:
        b["weight"] = round(b["weight"], 2)
        b["titles"] = sorted(b["titles"], key=len)[-examples * 3:][::-1][:examples]
    return ranked


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--subs", help="comma-separated subreddits (default: the host set)")
    ap.add_argument("--windows", default=",".join(WINDOWS), help="top windows: month,year")
    ap.add_argument("--pace", type=float, default=50.0,
                    help="seconds between requests; Reddit allows about one feed a minute")
    ap.add_argument("--max-seconds", type=float, default=600.0,
                    help="total time budget; stops fetching and reports what it has")
    ap.add_argument("--ttl", type=int, default=20 * 3600, help="cache lifetime in seconds")
    ap.add_argument("--refresh", action="store_true", help="ignore the cache")
    ap.add_argument("--themes", type=int, default=8, help="how many themes to report")
    ap.add_argument("--examples", type=int, default=3, help="example titles per theme")
    ap.add_argument("--json", action="store_true", dest="as_json")
    ap.add_argument("--quiet", action="store_true", help="no progress on stderr")
    a = ap.parse_args()

    subs = [s.strip() for s in (a.subs.split(",") if a.subs else SUBREDDITS) if s.strip()]
    windows = [w.strip() for w in a.windows.split(",") if w.strip()]
    verbose = not a.quiet

    if verbose:
        print(f"Reading {len(subs)} subreddits x {len(windows)} windows "
              f"(~{a.pace:.0f}s apart, cached {a.ttl // 3600}h, "
              f"{a.max_seconds:.0f}s budget)...", file=sys.stderr)

    deadline = time.time() + a.max_seconds
    seen: set[str] = set()
    entries: list[tuple[str, str, int]] = []          # (title, sub, rank)
    ok = cached = failed = 0
    # Windows outer, subs inner: with a budget that truncates, every subreddit
    # should get its "month" feed before any subreddit gets its "year".
    for window in windows:
        for sub in subs:
            xml, from_cache = fetch(sub, window, a.pace, a.ttl, a.refresh, verbose, deadline)
            if xml is None:
                failed += 1
                continue
            ok += 1
            cached += 1 if from_cache else 0
            for rank, title in enumerate(titles_from(xml)):
                key = re.sub(r"[^a-z0-9]+", "", title.lower())[:60]
                if key in seen:
                    continue
                seen.add(key)
                entries.append((title, sub, rank))

    if not entries:
        print("reddit-topics: every feed failed (Reddit is blocking or offline).\n"
              "Fall back to the ranked topic bank in prompt.md §2 — that is expected "
              "and fine.", file=sys.stderr)
        return 2

    useful = [(t, s, r) for t, s, r in entries if is_useful(t)]
    ranked = rank_themes(useful, covered_themes(), a.examples)
    fresh_themes = [b for b in ranked if not b["covered_by"]]
    done_themes = [b for b in ranked if b["covered_by"]]

    if a.as_json:
        print(json.dumps({
            "feeds_ok": ok, "feeds_failed": failed, "feeds_from_cache": cached,
            "posts_seen": len(entries), "posts_useful": len(useful),
            "themes": ranked,
        }, indent=2, ensure_ascii=False))
        return 0

    print(f"REDDIT DEMAND — {ok} feeds ({cached} cached, {failed} unavailable), "
          f"{len(entries)} posts, {len(useful)} carrying a real question")
    print()
    print("UNCOVERED THEMES — strongest demand first")
    if not fresh_themes:
        print("  (every theme is already covered — write a fresher angle on a top one)")
    for i, b in enumerate(fresh_themes[:a.themes], 1):
        print(f"{i:2}. {b['label']}  [{b['key']}]  {b['count']} posts, weight {b['weight']}")
        for t in b["titles"]:
            print(f"      · {t[:110]}")
    print()
    print("ALREADY COVERED")
    for b in done_themes[:8]:
        print(f"  - {b['label']} ({b['count']}) → {', '.join(sorted(set(b['covered_by'])))}")
    print()
    print("TOP QUESTION TITLES VERBATIM — the reader's own words, use them")
    on_topic = [e for e in useful if themes_of(e[0])]
    for title, sub, rank in sorted(on_topic, key=lambda e: e[2])[:15]:
        print(f"  · [r/{sub}] {title[:110]}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
