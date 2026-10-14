# Event Stories — Marketing Plan (living doc)

Owner: Robert · Maintained by: Hermes (social pipeline agent) · Last updated: 2026-10-14

## 1. What this is & how it's updated

- Hermes owns this file and runs every step in it. Robert reviews it and owns
  the decisions marked *Robert* in §9.
- Pipeline (Appwrite db `marketing`, app slug `event-stories`, on app.12f.dk):
  - Weekly cron (Monday) creates the week's posts with `status=queued`; `queue-comfyui` renders them (`queued` → `ready`); `publish-social` publishes once `scheduledAt` has passed.
  - Function `publish-social` (every 15 min) publishes to IG and FB; enforces a 20h minimum gap.
  - Function `collect-metrics` (every 2h) writes IG/FB engagement into the post docs.
  - Function `optimize-guidelines` (monthly) — **dormant**.
- The Monday cron also runs the §7 review and appends rows to §8.
- Editing rules for this file:
  - Append-only to §8: never delete or rewrite past log rows.
  - Plan changes go in §6, plus a §8 row that says why. §3 and §4 change only
    on Robert's say-so. Update `Last updated` on every edit.
  - Never put secrets, API keys or tokens in this file.

## 2. Product & funnel

- Product (LIVE iOS party/event planner, free with in-app purchases): guest
  list + RSVPs, budget tracking, schedule/timeline, vendors, tasks/checklists,
  photos/docs, PDF export, iCloud co-planner sync, offline, no account
  required. Site in English at event-stories.12f.dk.
- Funnel: profile bio → `https://event-stories.12f.dk/go/?src=instagram` (or
  `?src=facebook`) → hop fires `social-landing {src}` → straight to the store
  via `&to=` (bio links below) or the landing page (`social-landing-home`) →
  store taps (`appstore-click`, `hero-app-store-click`, `navbar-cta-click`,
  `sticky-download-click`, `footer-banner-app-store-click`, `playstore-click`,
  all tagged `src`) → App Store id6755695151
  `https://apps.apple.com/us/app/event-stories-party-planner/id6755695151`.
- Bio links (direct-to-store, tracked; exact URLs in
  `docs/social-source-links.md`): `/go/?src=instagram&to=<store>` and
  `?src=facebook&to=<store>`.
- The app is LIVE: the CTA is verbatim from ctaOptions, "Download free on the
  App Store". No "Get notified" copy.
- Downloads are counted in App Store Connect (and the Google Play Console for
  Android), not Umami.
- Details: `docs/social-source-links.md` (hop added in this PR).

## 3. Content rules

- Real footage and stills only. Assets: `/workspace/motion/assets/event-stories/`
  (es-c1..c5 clips, es-s1..s4 stills).
- Never AI-generated faces.
- No phone screens, and never app UI in generated images; phones face-down or
  in pocket only (matches the brand profile rule).
- One message per post; the hook lands in the first 1–2 seconds.
- At most 5 hashtags per post, always including `#afterstories`.
- One video per episode.
- Copy verbatim from the live site where possible, e.g. "Manage guest lists,
  track budgets, coordinate schedules, and organize vendors."
- Reels use audio `{"bed":"beat","clips":true}`. There is no music-variant
  rotation or tracking for event-stories.
- Carousels (8–12 slides) carry the saveable checklist, timeline and budget
  content. Slide 1 = concrete event + concrete problem; last slide = CTA.
- Available CTAs, verbatim: "Download free on the App Store", "Start planning
  your event today", "Tag someone planning a wedding", "Save this checklist
  for later".
- Voice: "your most organized friend who loves throwing parties" (brand
  profile) — empathetic about planning stress, never gatekeeping.
- A post that breaks a rule is not published: set it back from `ready` and log
  why in §8.

## 4. Cadence

- Shared-pipeline owner decision 2026-10-14 (Buffer ~2M-post study, Hootsuite,
  SocialCal).
- Ramp:

  | Week of | Posts |
  |---|---|
  | Oct 19 | 2 |
  | Oct 26 | 3–4 |
  | From Nov 2 | steady 4–5/week (2–3 reels + 1–2 carousels) |

- Floor: never below 3/week at steady state. Consistency beats bursts: if a
  week can't be filled, spread posts out instead of batching.
- Per-platform targets: Instagram 5–7/week Reels-led; Facebook 3–5/week
  Reels-priority. The shared pipeline posts every post to both, so the
  pipeline count is what each platform gets; 4–5 fits under the 20h gap (~8/
  week max) and avoids FB link posts. Instagram at 4–5/week sits below its
  5–7 target; accepted until the ramp is done.

## 5. Format playbook

| Format | Job | Evidence | Rules |
|---|---|---|---|
| Reel (30–60 s) | Reach to non-followers (+36% vs carousels) | The reach driver per the brand profile | Event reveals, before/after setups, planning hacks, with the real asset clips; product in second 0–1 |
| Carousel (8–12 slides) | Earns saves (+109% engagement per person reached) | Checklists/timelines/budgets are the most saveable | Slide 1 = concrete event + concrete problem; last slide = CTA |
| Stories | Polls, countdowns to events, vendor tips | Brand profile wants them daily | Pipeline is feed-only today — decision in §9 |
| Static image | Announcements only | Historically our best reach was story/advice images (baseline below) | Not in the steady mix; its lesson goes to carousel slide 1 |

Brand-profile pillar split: tips/checklists 35%, inspiration 25%, app
features 20%, seasonal 15%, user stories 5%. Audience: DIY event planners
(women 25–40: weddings, milestone birthdays, showers, reunions) plus Gen Z
casual gatherings. Pains: budget across vendors, co-planner coordination,
details scattered across apps.

Baseline (25 posts, all images, 21 with metrics; median reach 2; weak signal,
direction real):

- **Best, Mar–Apr** — reach 4–5: "Planning together changes everything"
  (wedding collab), "They did it" (graduation), "Stop losing track of RSVPs in
  your DMs".
- **Worst** — reach 1: generic seasonal openers, e.g. "Summer wedding season
  is coming. Are you ready?"
- Last published 2026-05-07. No reels or carousels yet.
- **Read:** a concrete event + a concrete problem wins. Banned opener: a
  season or event with no specific problem.

## 6. Content plan (next 4 weeks)

| Week of | # | Format | Feature / message | Hook (first 1–2 s) |
|---|---|---|---|---|
| Oct 19 | 1 | Reel | Guest list / RSVPs | "Halloween party in 12 days. Who actually said yes?" |
| Oct 19 | 2 | Carousel | Checklist / timeline | "Halloween party checklist: two weeks out to the doorbell." |
| Oct 26 | 1 | Reel | Budget tracking | "Halloween party budget: decorations, food, costumes — one total." |
| Oct 26 | 2 | Carousel | Co-planner sharing | "Planning a wedding together? One shared plan, synced via iCloud." |
| Oct 26 | 3 | Reel | Offline planning | "Basement venue, no signal — your guest list still opens." |
| Nov 2 | 1 | Reel | Co-planner sharing | "Two co-planners, one wedding to-do list, nothing done twice." |
| Nov 2 | 2 | Carousel | Budget tracking | "Wedding budget across every vendor, tracked in one place." |
| Nov 2 | 3 | Reel | Guest list / RSVPs | "Stop losing track of RSVPs in your DMs." |
| Nov 2 | 4 | Carousel | Checklist / timeline | "Baby shower timeline: six weeks out to the big day." |
| Nov 9 | 1 | Reel | Guest list + budget | "NYE party: who's bringing what, and what it costs." |
| Nov 9 | 2 | Reel | Photos & docs | "Graduation party: invites, receipts and photos in one app." |
| Nov 9 | 3 | Carousel | Checklist / timeline | "Class reunion checklist: find people, pick a date, track RSVPs." |
| Nov 9 | 4 | Carousel | Budget tracking | "NYE party budget: drinks, food, decorations, slide by slide." |

- Every post ends with "Download free on the App Store"; carousels may add
  "Save this checklist for later". All reels use `{"bed":"beat","clips":true}`.
- The Monday cron may swap a row only per a §7 verdict, and must log it in §8.

## 7. 7-day review procedure

1. Every Monday, select posts with `status=published` published 7–13 days ago
   and not yet in §8 (Appwrite `marketing`, appId `event-stories`).
2. For each post, read the metrics `collect-metrics` wrote into the post doc:
   reach, likes, comments, saves, shares (IG and FB). Note the doc's
   last-collected time.
3. Read Umami (site `0df3d4bd-48ba-46d8-b04c-bfee9f848988`) for the 7 days
   after publish: `social-landing` by `src` plus the store click events
   (incl. `playstore-click`) by `src`. Weekly context:
   `python3 /opt/data/scripts/travel_funnel_report.py --app event-stories`.
   Funnel context only — not tied to a single post.
4. Compute **reach = IG reach + FB reach** and
   **eng = likes + comments + saves + shares** (summed across both platforms).
5. Verdict:
   - **PASS**: reach ≥ 5, or saves ≥ 1, or shares ≥ 1.
   - **FAIL**: reach ≤ 1 and eng = 0.
   - **HOLD**: anything else.
   - **NO-DATA**: metrics missing, or last-collected time > 24h old. Rerun
     next week; do not judge the post.
6. Actions:
   - PASS: keep the format + message; add one more similar post (same feature,
     new event type) to §6 within 2 weeks.
   - HOLD: no change.
   - FAIL: rewrite the next planned §6 row with the same failure pattern
     (e.g. generic seasonal opener) to use a concrete event + problem hook.
   - Rotate out: a format+message combo that FAILs 2 reviews in a row is
     replaced in next week's plan by the best PASS combo.
   - The §4 cadence floor always holds.
7. Re-baseline: when the median reach of the last 8 reviewed posts is ≥ 20,
   propose new thresholds in §9 for Robert. Do not change them without his
   approval.
8. Append one row per post to §8, using this template:

   ```
   | YYYY-MM-DD | <post id> "<hook>" (<format>, <feature>) | IG r/l/c/s/sh · FB r/l/c/s/sh · Umami 7d ig/fb landings, store taps | PASS/HOLD/FAIL/NO-DATA | <change made, or "none"> |
   ```

## 8. Learnings log

Append-only. Newest at bottom. Never edit or delete rows.

| Date | Post | Numbers | Verdict | Change |
|---|---|---|---|---|
| 2026-10-14 | BASELINE: 25 posts (21 with metrics), all images | median reach 2; best reach 4–5 (Mar–Apr wedding collab, graduation, RSVPs-in-DMs); worst reach 1 (generic seasonal openers); last published 2026-05-07; no reels/carousels yet | BASELINE | Concrete event + concrete problem hooks; no generic seasonal openers. No /go hop existed before this PR: source-attributed funnel data starts once the bio links are set. |

## 9. Open questions & watch items

- **Bio links not set** (owner: Robert) — set them to the direct-to-store
  URLs in §2 after deploy.
- **/go hop untested live** (owner: Hermes) — verify after deploy. **Umami
  ingestion lag** (owner: Hermes) — do not read the funnel as final for the
  last 24–48h.
- **Stories decision** (owner: Robert) — the brand profile wants daily
  polls/countdowns; the pipeline is feed-only today.
- **Appwrite `umamiWebsiteId` is null** for `event-stories`; the funnel report
  takes the id via `--app` for now.
- **Review window** (resolved 2026-10-14) — "published 7–13 days ago, not yet
  reviewed" (§7 step 1) catches posts from any weekday.
- **Play Store listing** (owner: Robert) — `playstore-click` events exist, but
  the config hides the Play button and `llms-full.txt` says no Android
  version; confirm the listing. `optimize-guidelines` is dormant — enable once
  §8 has ≥ 4 weeks of logs.
