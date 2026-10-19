# Event Stories — Marketing Plan (living doc)

Owner: Robert · Maintained by: Hermes (social pipeline agent) · Last updated: 2026-10-19

## 1. What this is & how it's updated

- Hermes owns this file and runs every step in it. Robert reviews it and owns
  the decisions marked *Robert* in §9.
- Pipeline (Appwrite db `marketing`, app slug `event-stories`, on app.12f.dk):
  - Nightly job (`event-stories-social-content`, shared `social-post` template, channel
    platform): builds the next due §6 row — media rendered on the spark (`comfy-gen`,
    `motion-render`), created with `marketing-post` as `status=ready` at the time it picks
    (Hermes owns the schedule, marketing#97); `publish-social` publishes it then.
  - Function `publish-social` (every 15 min) publishes to IG and FB; enforces a 20h minimum gap.
  - Function `collect-metrics` (every 2h) writes IG/FB engagement into the post docs.
  - Function `optimize-guidelines` (monthly) — **dormant**.
- The nightly job also runs the §7 review and appends rows to §8.
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

- Text-slide colours: background #2d1b2e · text #f8f0e3 · accent #e8a87c
  (carousel text slides; `marketing-post --colors-from` reads this line, so
  keep its format. Robert's decision 2026-10-14, spark#129.)
- Real-looking footage and stills only (photographic event scenes, never
  illustration), shot fresh for every post: new stills/clips generated for that
  post (`comfy-gen`, LTX), never reused from an earlier post (Robert, spark#133).
  The files in `/workspace/motion/assets/event-stories/` (es-c1..c5 clips,
  es-s1..s7 stills) show the brand look; do not reuse them in a new post.
- Every post looks new: a different setting, light, colour mood and composition
  from the app's recent posts (`marketing-post looks --app event-stories`); for
  a reel also a different reel look. §6's Look column gives each row its own
  scene as a starting point.
- Never AI-generated faces.
- No phone screens, and never app UI in generated images; phones face-down or
  in pocket only (matches the brand profile rule).
- One message per post; the hook lands in the first 1–2 seconds.
- At most 5 hashtags per post, always including `#EventStories`. The rest come
  from the brand list (`#EventPlanning`, `#PartyPlanning`, `#WeddingPlanning`,
  `#BirthdayParty`, `#BabyShower`, `#EventOrganizer`, `#EventApp`,
  `#CelebrationPlanner`) plus at most one tag for the §6 calendar moment
  (e.g. `#Friendsgiving`, `#NYE`).
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
| Reel (30–60 s) | Reach to non-followers (+36% vs carousels) | The reach driver per the brand profile | Event reveals, before/after setups, planning hacks, with clips shot fresh for the post; product in second 0–1 |
| Carousel (8–12 slides) | Earns saves (+109% engagement per person reached) | Checklists/timelines/budgets are the most saveable | Slide 1 = concrete event + concrete problem; last slide = CTA |

**Carousels are photo-led (Robert, 2026-10-15):** most slides are
photographic; at most 2–3 short text slides (hook + one CTA). The 2026-10-15
carousels shipped "2 photos + 7 text" and read flat — rebuild as ≥6 rendered
photos + 1–2 text slides. Every photo slide is a fresh `comfy-gen` render
(photographic, no phone screens, no visible faces); the caption still carries
the saveable content, the slides carry the look.
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

### Claim sheet — what each §6 feature may say (added 2026-10-15)

Verbatim from the live site (homepage, its App Store description block, and
`llms-full.txt`, read 2026-10-15). Use these lines, not paraphrased numbers or
promises. Re-check the site if a line here and the site disagree; the site wins.

| §6 feature | Verbatim line(s) |
|---|---|
| Guest list / RSVPs | "Track RSVPs, manage contact info, dietary requirements, and plus-ones." · "Import guests directly from your contacts" |
| Budget tracking | "Visualize expenses by category, track payments to vendors, and stay on top of your event budget with clear charts." · "Track vendor quotes, deposits, and payments." |
| Schedule / timeline | "Build the run of show for the day with times, durations, and locations. Coordinate vendors and activities, then export to your calendar." |
| Seating planner | "Arrange tables and drag guests to their seats." · "Export your finished plan as a PDF to share with your venue." |
| Tasks / checklist | "Keep every to-do in one checklist with due dates and reminders — from booking the venue to sending the save-the-dates." |
| Vendors | "Keep all vendor contacts, quotes, contracts, and photos organized. Compare prices, track communications, and manage relationships with caterers, photographers, florists, and more." |
| Co-planner sharing | "Share your event with your partner, family, or wedding party. Everyone can view and edit in real-time with iCloud sync." |
| Offline | "Works offline - syncs when connected" · "perfect for venue visits" |
| PDF export | "Generate professional reports with guest lists, budgets, vendor contacts, and schedules to share with your team." |
| Photos & docs | "Store contracts, menus, seating charts, floor plans, and important documents securely in the app." · "Document your event journey with photos." |
| Wish list / registry | "Share beautifully formatted PDF lists with family and friends. Perfect for wedding registries, baby showers, and birthday gifts." |
| Several events | "You can create multiple events and switch between them." |
| Price | Free; "Premium Lifetime" is "a one-time purchase - never a subscription". Never quote a price. |

Never claim: an Android, iPad or Mac version; assigning tasks to people;
splitting bills; guest-facing invitations or RSVP links; any user count,
rating or testimonial.

## 6. Content plan (week of Oct 19, 2026 – week of Feb 22, 2027)

### Calendar hooks — the moments this plan piggybacks on (added 2026-10-15)

The calendar is the reach engine: a post that lands while people are actually
planning THAT event beats a post about the event in general. Post ~1–3 weeks
before people plan the event (often well before the date itself), and let the
hook name the event AND a concrete problem — "Halloween is coming!" alone is
the banned generic seasonal opener (§5 baseline). The moment also gives the
post its look for free (light, props, palette), which keeps every post new.

| Moment | Date | Post by | Use case | Angle | §6 rows |
|---|---|---|---|---|---|
| **Halloween** | Sat Oct 31, 2026 | Oct 28 | house / costume party | the guest count and the party budget, 1–2 weeks out | Oct 19 #1–#2, Oct 26 #1, #3 |
| **Friendsgiving** | no fixed date; usually the weekend(s) before Thanksgiving (~Nov 21) | Nov 16 | potluck dinner with friends | who comes, who can't eat what, who brings what | Oct 26 #4, Nov 16 #1 |
| **Thanksgiving (US)** | Thu Nov 26, 2026 | Nov 19 | family dinner, first-time host | one oven, one timeline; the seating; the cabin with no signal | Nov 9 #1, #5, Nov 16 #2, Nov 23 #1, #3 |
| **Office holiday parties** | late Nov – mid Dec; venues and caterers get booked in Oct–Nov | Nov 20 | corporate event | venue deposits, vendor quotes, the run of show as one PDF | Nov 2 #5, Nov 9 #4, Nov 16 #3, #5, Nov 23 #2, Nov 30 #5 |
| **Hanukkah** | sundown Fri Dec 4 – Sat Dec 12, 2026 | Dec 1 | holiday party at home | headcount → how much food | Nov 23 #4 |
| **Christmas / holiday parties** | Fri Dec 25, 2026 (parties all of Dec) | Dec 18 | family dinner, party at home, gift lists | budget, seating, two families on one plan, wish lists | Nov 16 #4, Nov 30 #1–#3, Dec 7 #3, #5, Dec 14 #1–#2, Dec 21 #3 |
| **New Year's Eve** | Thu Dec 31, 2026 | Dec 28 | house party | RSVPs, who brings what, the budget, the last 24 hours, no signal at midnight | Nov 30 #4, Dec 7 #1–#2, Dec 14 #4, Dec 21 #1, #4, Dec 28 #1, #4 |
| **Engagement season → wedding planning** | engagements cluster Christmas → Valentine's Day; planning starts in January (no figure claimed) | from Dec 7 | wedding | first decisions, guest-list size, vendors, co-planning with a partner | Dec 7 #4, Dec 14 #3, Dec 21 #2, Dec 28 #3, Jan 4 #1–#4, Jan 11 #3, #5, Jan 18 #3–#4, Feb 1 #4, Feb 8 #2–#3, Feb 22 #3 |
| **New year, new plans** | January | Jan 8 | several events in one year | three 2027 events, one app | Dec 21 #3, Dec 28 #2 |
| **Burns Night** (UK, niche) | Mon Jan 25, 2027 | Jan 18 | supper at home | the order of the evening | Jan 11 #1 |
| **Lunar New Year** | Sat Feb 6, 2027 (Year of the Goat) | Jan 30 | family reunion dinner | three generations: the guest list and the seating | Jan 18 #1, Feb 1 #5 |
| **Galentine's Day** | Sat Feb 13, 2027 | Feb 6 | brunch with friends | small plan, saveable checklist | Jan 18 #2 |
| **Super Bowl LXI** watch party | Sun Feb 14, 2027 (SoFi Stadium) | Feb 10 | watch party at home | headcount, food per person, food timing | Jan 25 #1–#2, Feb 1 #1, Feb 8 #1 |
| **Valentine's Day** | Sun Feb 14, 2027 — the same day as the Super Bowl | Feb 6 | dinner party for couples | two events on one Sunday | Jan 25 #3, Feb 1 #2 |
| **Mothering Sunday** (UK/IE) | Sun Mar 7, 2027 | Feb 28 | family lunch | siblings planning together | Feb 15 #1 |
| **Easter** | Sun Mar 28, 2027 | Mar 14 | family lunch / brunch | who hosts, the 4-week checklist | Feb 15 #3, Feb 22 #2 |
| **Spring showers** (baby, bridal, gender reveal) | Mar–May 2027 | 6–8 weeks before | shower | timeline, gift list, co-hosts | Jan 11 #2, Feb 1 #3, Feb 15 #2, Feb 22 #4 |
| **Graduation season** | May–June 2027 | start Feb 22; peak in the next plan (Apr) | graduation party | book the tent, the caterer, the date early | Feb 22 #1 |
| **Mother's Day (US)** | Sun May 9, 2027 | ~Apr 25 | family brunch | next plan (after Feb) | — |
| Kids' and milestone birthdays | all year | — | birthday | allergies, surprise plans, restaurant deposits; fills weeks without a big moment | Nov 2 #3, Jan 4 #5, Jan 11 #4, Jan 25 #4, Feb 15 #4 |

Not planned, on purpose (see §9): **Diwali** (Sun Nov 8, 2026 — only 3 weeks
away and no audience data for it), **Mardi Gras** (Tue Feb 9, 2027 — US
niche), **Danish julefrokost** (Nov–Dec — the site and posts are English and
no audience data shows a Danish following).

Dates checked 2026-10-15 (web search: Super Bowl LXI, Lunar New Year 2027,
Mothering Sunday / US Mother's Day 2027, Diwali 2026, Hanukkah 2026; the
others are fixed dates or computed from fixed rules: Thanksgiving = 4th
Thursday of November, Easter 2027 = Mar 28). The NFL called the Super Bowl
LXI date "tentative" when it awarded the game; re-check it before the Jan 25
rows are built. Friendsgiving, office-party season and engagement season are
patterns, not dates: never state a date or a statistic for them in a post.

### The plan

| Week of | # | Format | Feature / message | Hook (first 1–2 s) | Look / scene (start point; must differ from recent looks) | Status |
|---|---|---|---|---|---|---|
| Oct 19 | 2 | Carousel | Checklist / timeline | "Halloween party checklist: two weeks out to the doorbell." | — | — | published 2026-10-15 6ad00941d7b6ea002b02 (text-heavy, superseded) |
| Oct 15 | 1 | Carousel | Co-planner sharing (wedding) | "120 guests. 14 vendors. 3 months." (photo-led rebuild) | 7 photos + 2 text | — | published 2026-10-15 6ad0c101c6029493303d, IG p/Deg7gp2Cdfd |
| Oct 26 | 1 | Reel | Budget tracking | "Halloween party budget: decorations, food, costumes — one total." | kitchen counter at night, pumpkins and craft-store bags, amber candle light, handheld close-ups | built 2026-10-19 6ad57b66252b0cf6bddf |
| Oct 26 | 2 | Carousel | Co-planner sharing | "Planning a wedding together? One shared plan, synced via iCloud." | Sunday-morning sofa, two coffee cups, linen and sage, soft window daylight | queued |
| Oct 26 | 3 | Reel | Offline planning | "Basement venue, no signal — your guest list still opens." | brick basement venue mid-setup, string lights, cool tungsten, phone in back pocket | queued |
| Oct 26 | 4 | Carousel | Guest list (dietary) | "Friendsgiving for 12: who's vegan, who's gluten-free, who's bringing pie?" | overhead harvest table, rust and cream, late-afternoon side light | queued |
| Nov 2 | 1 | Reel | Co-planner sharing | "Two co-planners, one wedding to-do list, nothing done twice." | florist's workshop, eucalyptus and ribbon, cool morning light, slow pans | queued |
| Nov 2 | 2 | Carousel | Budget tracking | "Wedding budget across every vendor, tracked in one place." | paper flat-lay: swatches, contract envelopes, calculator, ivory and gold | queued |
| Nov 2 | 3 | Reel | Guest list / RSVPs | "30th birthday, 40 invites: stop losing track of RSVPs in your DMs." | rooftop bar at dusk, balloons in the wind, pink-orange sky | queued |
| Nov 2 | 4 | Carousel | Checklist / timeline | "Baby shower timeline: six weeks out to the big day." | pastel living room, paper garlands, bright flat daylight | queued |
| Nov 2 | 5 | Reel | Vendors | "Office Christmas party in 6 weeks — the venue wants a deposit by Friday." | empty event hall being measured, tape measure, grey-blue daylight | queued |
| Nov 9 | 1 | Reel | Schedule / timeline | "Thanksgiving for 14, one oven: what goes in at 10, what at 2?" | early-morning kitchen, frost on the window, steam, cold-to-warm light | queued |
| Nov 9 | 2 | Reel | Photos & docs | "Wedding venue tour number three: which one had the garden?" | empty barn venue, dust in golden light, wide shots | queued |
| Nov 9 | 3 | Carousel | Checklist / timeline | "Class reunion checklist: find people, pick a date, track RSVPs." | school gym with bunting, old yearbooks, 90s film grain | queued |
| Nov 9 | 4 | Carousel | Budget tracking | "Office holiday party for 40: where the budget goes, slide by slide." | loft office after hours, brass and bottle green, overhead | queued |
| Nov 9 | 5 | Reel | Seating planner | "Thanksgiving: three tables, two uncles who can't sit together." | dining room from above, place cards, mustard and plum, warm tungsten | queued |
| Nov 16 | 1 | Reel | Tasks / checklist | "Friendsgiving potluck: three mashed potatoes, zero pies." | apartment hallway, friends arriving with dishes (no faces), cool evening blue | queued |
| Nov 16 | 2 | Carousel | Checklist / timeline | "Hosting Thanksgiving for the first time? The 10-day countdown." | farmhouse table, deep burgundy, taper candles, low-key | queued |
| Nov 16 | 3 | Reel | Vendors | "Christmas party: caterer, DJ, venue — three quotes in three email threads." | city bar at blue hour, neon reflections on glass | queued |
| Nov 16 | 4 | Carousel | Wish list / registry | "Office Secret Santa, 20 names: one wish list, one PDF." | wrapping-paper flat-lay, kraft paper and red twine, daylight | queued |
| Nov 16 | 5 | Reel | Schedule → calendar export | "Christmas party Friday: setup at 4, doors at 7, speeches at 8 — in your calendar." | hotel function room mid-setup, round tables, crisp white light | queued |
| Nov 23 | 1 | Reel | Offline planning | "Thanksgiving at the family cabin, zero bars — the plan still opens." | snowy cabin porch, woodsmoke, cold dusk, phone in coat pocket | queued |
| Nov 23 | 2 | Carousel | Checklist / timeline | "Office Christmas party in 3 weeks: the checklist from venue to taxis home." | corporate lobby with a tree, glass and steel, cool palette | queued |
| Nov 23 | 3 | Reel | Photos & docs | "Thanksgiving's done. The menu, the seating chart, the photos — still in one place?" | morning-after table, half-cleared, pale grey light | queued |
| Nov 23 | 4 | Carousel | Guest list / RSVPs | "Hanukkah party on night one: 18 guests — how many latkes?" | blue and silver table, candlelight, close detail shots | queued |
| Nov 30 | 1 | Reel | Budget tracking | "Christmas party budget: last year the drinks ran out at 9." | home bar cart, ice and citrus, warm red light | queued |
| Nov 30 | 2 | Carousel | Checklist / timeline | "Cookie-swap party for 10: from the invite to the clean-up." | flour-dusted counter, cookie tins, bright morning | queued |
| Nov 30 | 3 | Reel | Co-planner sharing | "Two families, one Christmas dinner — one plan you can both edit." | two front doors with wreaths, snow, split-screen feel | queued |
| Nov 30 | 4 | Carousel | Checklist / timeline | "NYE party: 4 weeks, 2 weeks, 2 hours before midnight." | black and gold, sequins, macro shots | queued |
| Nov 30 | 5 | Reel | PDF export | "Office party: the venue manager wants the run of show — send one PDF." | back-of-house corridor, catering trolleys, fluorescent-to-warm | queued |
| Dec 7 | 1 | Reel | Guest list + budget | "NYE party: who's bringing what, and what it costs." | living room cleared for a party, disco ball light flecks | queued |
| Dec 7 | 2 | Carousel | Budget tracking | "NYE party budget: drinks, food, decorations, slide by slide." | champagne coupes and receipts, deep navy, overhead | queued |
| Dec 7 | 3 | Reel | Seating planner | "Christmas dinner for 16: kids' table or not?" | long table with crackers and greenery, warm firelight | queued |
| Dec 7 | 4 | Carousel | Checklist (wedding) | "Engaged over the holidays? The first 10 wedding decisions, in order." | ring dish on a window sill, winter daylight, soft whites | queued |
| Dec 7 | 5 | Reel | Guest list (import contacts) | "Christmas party invites: start from your contacts, not a blank page." | coffee shop corner, notebook, rain on the window | queued |
| Dec 14 | 1 | Reel | Schedule / timeline | "Christmas Eve: ham at 3, guests at 6, presents at 9." | oven light glow, timer, steam, close-ups | queued |
| Dec 14 | 2 | Carousel | Wish list / registry | "Three grandparents asking what the kids want: one wish list PDF." | kids' room, paper stars, soft pastel light | queued |
| Dec 14 | 3 | Reel | Budget tracking (payments) | "Summer wedding: the venue deposit is due in January — what's paid, what's pending?" | wedding-venue office, ledger and pen, cool winter light | queued |
| Dec 14 | 4 | Carousel | Checklist / timeline | "NYE house party: the 2-week checklist." | hallway with coat rack and party hats, warm yellow | queued |
| Dec 21 | 1 | Reel | Guest list / RSVPs | "NYE in 10 days: 25 invited, 9 replied." | snowy street at night, lit windows from outside | queued |
| Dec 21 | 2 | Carousel | Guest list (wedding) | "Engaged at Christmas? Before you book anything: decide the guest count." | two mugs and a guest list on paper, fireplace glow | queued |
| Dec 21 | 3 | Reel | Several events | "Christmas Eve, Boxing Day brunch, NYE — three parties, three plans." | three table settings in sequence, morning → noon → night light | queued |
| Dec 21 | 4 | Carousel | Schedule / timeline | "NYE: the last 24 hours, hour by hour." | clock faces and confetti, high contrast black/silver | queued |
| Dec 28 | 1 | Reel | Offline planning | "NYE rooftop party, network jammed at midnight — your guest list still opens." | rooftop in the cold, fireworks bokeh, phone in pocket | queued |
| Dec 28 | 2 | Carousel | Several events | "2027: a 40th, a wedding, a baby shower. Where do the plans live?" | fresh paper calendar, pens, crisp January white | queued |
| Dec 28 | 3 | Reel | Budget tracking (wedding) | "Wedding in 2027, budget not set: start with the cost per guest." | quiet winter café, notebook, muted teal | queued |
| Dec 28 | 4 | Carousel | Checklist / timeline | "New Year's Day brunch for 10, the morning after your NYE party." | pancakes and juice, low sun, sleepy pastels | queued |
| Jan 4 | 1 | Reel | Co-planner sharing | "Just engaged: two phones, two notes apps, one wedding." | apartment kitchen table at night, warm lamp pool | queued |
| Jan 4 | 2 | Carousel | Checklist (wedding) | "Wedding in 12 months: the month-by-month checklist." | planner flat-lay, dried flowers, linen, overhead daylight | queued |
| Jan 4 | 3 | Reel | Vendors (compare quotes) | "Photographer, florist, band: whose quote was cheaper again?" | three vendor studios in quick cuts, each its own palette | queued |
| Jan 4 | 4 | Carousel | Guest list (wedding) | "Wedding guest list at 180, venue holds 120: how to cut it." | empty reception hall with stacked chairs, cool morning | queued |
| Jan 4 | 5 | Reel | Guest list (dietary) | "Kid's 5th birthday: 15 classmates, 3 allergies." | play café, bright primaries, low child-height angles | queued |
| Jan 11 | 1 | Reel | Schedule / timeline | "Burns Night supper for 10: haggis, whisky, and the order of the toasts." | tartan and candlelight, dark wood, low-key | queued |
| Jan 11 | 2 | Carousel | Wish list / registry | "Baby shower in March: the gift list, 8 weeks out." | nursery corner, soft knits, pale yellow daylight | queued |
| Jan 11 | 3 | Reel | Seating planner | "Wedding seating chart: divorced parents, one head table." | marquee interior, round tables, diffuse white light | queued |
| Jan 11 | 4 | Carousel | Tasks / checklist | "Surprise 40th in March: the 8-week secret plan." | hidden boxes in a closet, torch-light, playful shadows | queued |
| Jan 11 | 5 | Reel | PDF export | "The wedding coordinator wants guests, budget and vendors — send one PDF." | coordinator's desk in a stately home, green leather, window light | queued |
| Jan 18 | 1 | Reel | Guest list / RSVPs | "Lunar New Year dinner for 12: who's coming, who can't eat what?" | red lanterns, round table, steam from dishes, warm red light | queued |
| Jan 18 | 2 | Carousel | Checklist / timeline | "Galentine's brunch for 8: the plan in 7 slides." | pink and terracotta brunch table, flowers, bright midday | queued |
| Jan 18 | 3 | Reel | Offline planning | "Venue tour at a countryside manor, no signal — your vendor notes are still there." | gravel drive and stone manor, overcast, muted greens | queued |
| Jan 18 | 4 | Carousel | Budget tracking (wedding) | "Wedding under $10k: where the money goes." | backyard wedding set-up in winter sun, mason jars, honey tones | queued |
| Jan 25 | 1 | Reel | Guest list / RSVPs | "Super Bowl watch party on Feb 14: 20 invited — who's actually coming?" | den with big screen glow (no screen content), team-colour cushions | queued |
| Jan 25 | 2 | Carousel | Checklist (food per person) | "Super Bowl party for 20: how much food per person?" | wings, dips and chips from above, bold saturated colour | queued |
| Jan 25 | 3 | Reel | Several events | "Valentine's Day and the Super Bowl on the same Sunday: plan both." | split scene: candlelit table vs snack table, red vs green | queued |
| Jan 25 | 4 | Carousel | Schedule / timeline | "Kids' birthday at home: 2 hours, 12 kids, minute by minute." | living room with craft table, confetti, bright flat light | queued |
| Feb 1 | 1 | Reel | Schedule / timeline | "Super Bowl Sunday: food out before kickoff, dessert at halftime." | kitchen island with timers, evening tungsten, fast cuts | queued |
| Feb 1 | 2 | Carousel | Checklist / timeline | "Valentine's dinner party for 4 couples: menu to candles." | deep red and brass, candle clusters, low-key | queued |
| Feb 1 | 3 | Reel | Co-planner sharing | "Baby shower with two co-hosts: who ordered the cake?" | bakery counter, pastel boxes, morning light | queued |
| Feb 1 | 4 | Carousel | Schedule (wedding) | "Wedding day timeline: getting ready to last dance." | bridal suite (no faces), veil on a hanger, soft backlight | queued |
| Feb 1 | 5 | Reel | Seating planner | "Lunar New Year reunion dinner: three generations, one seating plan." | round banquet table from above, gold and red, lazy Susan | queued |
| Feb 8 | 1 | Reel | Guest list / notes | "Super Bowl party in 4 days: who said yes, who's bringing chips?" | garage fridge stocked, cool white light, close-ups | queued |
| Feb 8 | 2 | Carousel | Checklist (wedding) | "Spring wedding in 10 weeks: what must be booked by now." | greenhouse with early blooms, fresh green, misty light | queued |
| Feb 8 | 3 | Reel | Guest list / RSVPs (wedding) | "Save-the-dates are out: 120 guests, every RSVP in one list." | post box and envelope stack, winter street, cool blue | queued |
| Feb 8 | 4 | Carousel | Vendors | "Hiring a caterer for a 60th? 8 questions before you sign." | catering kitchen pass, stainless steel, warm heat lamps | queued |
| Feb 15 | 1 | Reel | Co-planner sharing | "Mothering Sunday lunch on March 7: three siblings, one plan." | country pub dining room, daffodils, soft spring light | queued |
| Feb 15 | 2 | Carousel | Checklist / timeline | "Gender reveal in 3 weeks: guests, cake, the reveal moment." | backyard with balloons, pastel smoke, late-afternoon | queued |
| Feb 15 | 3 | Reel | Guest list / RSVPs | "Easter lunch for 14 on March 28: who's hosting this year?" | spring garden table, eggs and tulips, fresh morning | queued |
| Feb 15 | 4 | Carousel | Budget tracking | "30th birthday at a restaurant: deposit, set menu, cake — the budget." | restaurant private room, dark green walls, candlelight | queued |
| Feb 22 | 1 | Reel | Vendors | "Graduation party in May: book the backyard tent now." | empty backyard, tent poles stacked, bright cold sun | queued |
| Feb 22 | 2 | Carousel | Checklist / timeline | "Easter brunch for 12 on March 28: the 4-week checklist." | pastel brunch spread, linen napkins, high-key light | queued |
| Feb 22 | 3 | Reel | Photos & docs | "Wedding contracts in four inboxes: keep every one with the event." | paper contracts on a rainy-window desk, moody grey | queued |
| Feb 22 | 4 | Carousel | Checklist / timeline | "Bridal shower in April: the 8-week plan." | tea-party table, florals, soft peach daylight | queued |

Plan totals (by week-of month): 82 posts — Oct 6 (2 built/posted + 4 queued),
Nov 24, Dec 17, Jan 18, Feb 17. Reels 45, carousels 37.

- Every post ends with "Download free on the App Store"; carousels may add
  "Save this checklist for later". All reels use `{"bed":"beat","clips":true}`.
- The Look column is a starting point, not a script: the nightly job still
  checks `marketing-post looks` and changes anything that repeats a recent post.
  Hooks may be tightened; the event + problem must stay.
- Hooks name dates only when the date is in the calendar hooks table. Numbers
  in hooks (12 guests, 3 allergies) are the scenario, not a statistic; keep
  them as scenarios, never as claims about users.
- The nightly job may swap a row only per a §7 verdict, and must log it in §8.
- **Status** (spark#136): `queued` → `built <date> <postId>` (created, scheduled)
  → `posted <date> <postId>`. The nightly job builds the first `queued` row whose
  week starts within 7 days, one row per night, and writes its status here.
- Extend the plan by ~4 weeks when fewer than 4 weeks of `queued` rows remain
  (next: Mar 2027 — Mothering Sunday, Easter, spring showers, graduation,
  US Mother's Day May 9), using the calendar hooks table; log it in §8.

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
| 2026-10-15 | §7 review: window Oct 2–8 | no event-stories posts published in the window (last publish 2026-05-07); funnel 7d: 0 landings, 1 App Store tap | NO-DATA | none — no posts to judge; week of Oct 19 rows executed as planned (reel + carousel, no swap) |
| 2026-10-19 | §7 review: window Oct 6–12 | no event-stories posts published in the window (last publish 2026-10-15, 4 days ago); funnel 7d: 0 landings, 1 App Store tap | NO-DATA | none — no posts to judge; week of Oct 26 #1 built (reel, budget tracking, scheduled 2026-10-27T18:00Z) |

- 2026-10-15 — plan format: §6 got a Status column and the content job runs nightly (one due row per night) instead of Monday-weekly (Robert; spark#136). Rows Oct 19 #1–#2 were built by the earlier weekly runs.
- 2026-10-15 — plan expanded (Robert's request: a full post-by-post plan through the next months that piggybacks on external events such as Halloween): §6 now runs week of Oct 19, 2026 – week of Feb 22, 2027 (82 rows, 80 queued) with a Calendar hooks table and a Look column so each row starts from a distinct scene (every post looks new, spark#133); §5 got a claim sheet of verbatim site lines. Changed queued rows: Oct 26 #4 added (Friendsgiving, ramp 3–4); Nov 2 #3 hook now names an event ("30th birthday, 40 invites: stop losing track of RSVPs in your DMs." — every hook must be event + problem); Nov 2 #5 added (office party); Nov 9 #1 and #4 (NYE) moved unchanged to Dec 7 #1–#2 because NYE is 7 weeks out on Nov 9, replaced by Thanksgiving schedule and office-party budget; Nov 9 #2 graduation → wedding venue tour (graduation is a May–June moment); Nov 9 #5 added. §3 (Robert's say-so, both implied by his rules): hashtag rule fixed from the After Stories brand tag (a copy-paste error from that app) to `#EventStories` plus the app record's brandHashtags; the assets line now follows the fresh-shoot rule (spark#133) instead of "Real footage and stills only" from the fixed asset set. §4 unchanged.
- 2026-10-19 — Week of Oct 26 #1 built: reel (31 s, budget tracking, hook on frame 0) in a new "bold night-kitchen cut" look — heavy white sans caps with a pumpkin-orange #FF6A13 chip on dark plum, no serif, no gold, no editorial-scrim reuse (differs from the 2026-10-15 editorial-gold Halloween reel and the bright garden/sage carousel); fresh shoot es-hb-s1…s7 (7 new stills, 3 LTX clips; s1 and s5 re-shot after first takes failed frame review — a hand entering + pumpkin morph, and garbled pseudo-text). Post 6ad57b66252b0cf6bddf, status ready, scheduled 2026-10-27T18:00Z (Tuesday, active day/hour; inside the row's week, ≥20 h from all other slots). Upload encode: 2-pass h264 1.7 Mbps + aac 128k → 7.0 MB (under the 8 MB upload limit, §9).

## 9. Open questions & watch items

- **Bio links not set** (owner: Robert) — set them to the direct-to-store
  URLs in §2 after deploy.
- **/go hop untested live** (owner: Hermes) — verify after deploy. **Umami
  ingestion lag** (owner: Hermes) — do not read the funnel as final for the
  last 24–48h.
- **Stories decision** (owner: Robert) — the brand profile wants daily
  polls/countdowns; the pipeline is feed-only today.
- **Upload size cap** (owner: Hermes) — the platform's upload path rejects
  request bodies between 8 and 12 MB (8 MB passes, 12 MB gets a 413 /
  connection reset). Reels must be encoded under that: 2-pass h264 at 2.6 Mbps
  + aac 128k put a 32 s 1080x1920 reel at 9.3 MB (found 2026-10-15).
- **Appwrite `umamiWebsiteId` is null** for `event-stories`; the funnel report
  takes the id via `--app` for now.
- **Review window** (resolved 2026-10-14) — "published 7–13 days ago, not yet
  reviewed" (§7 step 1) catches posts from any weekday.
- **Play Store listing** (owner: Robert) — `playstore-click` events exist, but
  the config hides the Play button and `llms-full.txt` says no Android
  version; confirm the listing. `optimize-guidelines` is dormant — enable once
  §8 has ≥ 4 weeks of logs.
- **Audience markets unknown** (owner: Robert) — the plan leans US
  (Thanksgiving, Super Bowl, US Mother's Day) with UK extras (Burns Night,
  Mothering Sunday). Check the IG/FB audience by country; if the following is
  mostly elsewhere, swap the Jan 11 #1 and Feb 15 #1 rows (and add local
  moments, e.g. Danish julefrokost, only if the data shows a Danish audience).
- **Super Bowl LXI date** (owner: Hermes) — Sun Feb 14, 2027 at SoFi Stadium,
  but the NFL called it tentative when it awarded the game. Re-check before
  building the Jan 25 rows; never state a kickoff time.
- **Skipped moments** (owner: Robert) — Diwali (Nov 8, 2026) and Mardi Gras
  (Feb 9, 2027) are not planned (no audience data, too close / US niche). Add
  them next year if the audience supports it.
- **Pattern moments have no date** — Friendsgiving, office-party season and
  engagement season are timed by habit, not a calendar date. Posts must not
  state a date or a statistic for them.
- **More CTAs in the brand record** (owner: Robert) — the app record's
  ctaOptions also has "Link in bio", "Share with your co-planner", "Which
  event are you planning next? Comment below" and "Try Event Stories free".
  §3 lists four; decide whether to add the others (the co-planner rows fit
  "Share with your co-planner").
- **Reel music rotation** (owner: Robert) — §3 says reels use one audio bed
  with no variant rotation, while the shared template (spark#133) asks for a
  music variant not used in the last 6 reels. §3 wins today; decide whether
  event-stories reels should rotate music too.
