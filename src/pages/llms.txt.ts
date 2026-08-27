import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

// llms.txt is generated rather than committed as a static file. The previous
// hand-maintained public/llms.txt listed only the homepage and the three policy
// pages, so the entire blog — the site's actual content library — was invisible
// to AI crawlers, and its "Last updated" line drifted months out of date.
// Generating it from the content collection means neither can happen again.

const SITE = "https://event-stories.12f.dk";

export const GET: APIRoute = async () => {
  const posts = (await getCollection("blog", ({ data }) => !data.draft)).sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf(),
  );

  const iso = (d: Date) => d.toISOString().slice(0, 10);
  // Newest post date, falling back to build date for an empty collection.
  const lastUpdated = posts.length ? iso(posts[0].data.publishDate) : iso(new Date());

  const body = `# Event Stories: Party Planner

> Event Stories is a free iOS app (iPhone, iOS 17.0+) that gives event hosts, wedding planners, and party organizers a single place to manage guest lists, budgets, schedules, and vendors — then export the whole plan as a professional PDF. Works fully offline, syncs via iCloud, and collects zero personal data.

## Key Facts

- **Name**: Event Stories: Party Planner
- **Platform**: iPhone (iOS 17.0+)
- **Price**: Free (optional Premium Lifetime upgrade — one-time purchase, no subscription)
- **Developer**: Robert Jensen (12f)
- **App Store**: https://apps.apple.com/dk/app/event-stories-party-planner/id6755695151
- **Website**: ${SITE}
- **Contact**: robert@12f.dk
- **Last updated**: ${lastUpdated}

## Who it's for

- Couples planning weddings who want one app for guests, budget, vendors, and timeline
- Parents planning birthday parties, showers, and family celebrations
- Corporate event coordinators who need shareable PDF reports for stakeholders
- Fundraiser and gala organizers tracking sponsors and attendees
- Anyone hosting a multi-vendor event who wants to stop juggling spreadsheets

## Problem it solves

Event hosts typically juggle 3–6 separate tools — spreadsheets for guests, a notes app for vendors, a calendar for the timeline, and screenshots for the budget. Event Stories consolidates all of that into one iPhone-native app that works offline (useful at venues with bad signal) and exports everything as a single PDF.

## Why choose Event Stories

- **All-in-one**: guest list + budget + schedule + vendors in one app, not four
- **Offline-first**: every feature works without internet — ideal for venue walkthroughs
- **Privacy-first**: data stored locally, optional iCloud sync, zero tracking, no ads
- **Professional PDF export**: one tap generates a shareable report
- **Native iOS**: not a web wrapper; uses native iOS patterns, widgets, and iCloud

## Features

- **Guest List Management** — RSVP tracking (invited, confirmed, declined, maybe), dietary needs, plus-ones, seating/table assignments
- **Budget Tracking** — visual expense charts by category, vendor payment tracking, remaining budget at a glance
- **Schedule & Timeline** — detailed event-day timelines with map integration and reminders
- **Vendor Management** — contacts, contracts, payments, and communications in one place
- **PDF Export** — professional reports combining guests, budget, vendors, and schedule
- **iCloud Sync** — events stay up to date across iPhone and other Apple devices
- **Offline Support** — full functionality without internet access
- **Photo Documentation** — capture and organize event photos and inspiration
- **Task Management** — to-do lists and checklists with priorities

## Pages

- [Home](${SITE}/): App overview, features, how it works, FAQ
- [Blog](${SITE}/blog/): Practical guides on planning, budgeting, and running great events
- [Privacy Policy](${SITE}/privacy-policy/): Data handling and privacy commitments
- [Terms and Conditions](${SITE}/terms-and-conditions/): Usage terms
- [Cookies Policy](${SITE}/cookies-policy/): Cookie usage (none for tracking)

## Guides

Long-form, independently useful guides. Each is written by Robert Jensen and covers one planning problem end to end.

${posts
  .map(
    p =>
      `- [${p.data.title}](${SITE}/blog/${p.slug}/) (${iso(p.data.publishDate)}): ${p.data.description}`,
  )
  .join("\n")}

## Quick Answers

- **Is it free?** Yes. Optional Premium Lifetime upgrade (one-time, no subscription).
- **Does it work offline?** Yes — fully offline, ideal for venue visits.
- **Android version?** Not currently. iPhone-only (iOS 17.0+).
- **Does it share data?** No. Data stays on device; optional iCloud sync uses your private iCloud account.
- **Can I share plans with co-planners?** Yes, via professional PDF export.
- **In-app purchases?** One-time Premium Lifetime upgrade. No ads, no subscriptions.

## Detailed Information

For complete app details, use cases, and technical specs, see: ${SITE}/llms-full.txt
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
