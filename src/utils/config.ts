import type { TemplateConfig } from "./configType";

const templateConfig: TemplateConfig = {
  name: "Event Stories",
  seo: {
    title: "Event Stories - Free Party Planner App for iPhone",
    description:
      "Plan your perfect event with guest lists, budget tracking, schedules, and vendor management. Export professional PDF reports. Free for iPhone - download now!",
  },
  // Draws grid behind main container
  backgroundGrid: false,
  logo: "/logo.png",
  theme: "home",
  // Forces theme to be chosen above, no matter what user prefers
  forceTheme: false,
  // Shows switch to toggle between dark and light modes
  showThemeSwitch: true,
  appStoreLink:
    "https://apps.apple.com/dk/app/event-stories-party-planner/id6755695151",
  googlePlayLink: "",
  footer: {
    legalLinks: {
      termsAndConditions: false,
      cookiesPolicy: false,
      privacyPolicy: false,
    },
    socials: {},
    links: [
      { href: "/#features", title: "Features" },
      { href: "/#how-it-works", title: "How it works" },
      { href: "/#faq", title: "FAQ" },
    ],
  },
  topNavbar: {
    cta: "Get the app",
    disableWidthAnimation: false,
    hideAppStore: false,
    hideGooglePlay: true,
    links: [
      { href: "/#features", title: "Features" },
      { href: "/#how-it-works", title: "How it works" },
      { href: "/#faq", title: "FAQ" },
    ],
  },
  appBanner: {
    id: "app-banner",
    title: "Download Event Stories Today!",
    subtitle:
      "Your complete event planning companion. Manage guest lists, track budgets, coordinate schedules, and organize vendors. Available on the App Store.",
    screenshots: [
      "/screenshots/projects-list.webp",
      "/screenshots/guest-list.webp",
      "/screenshots/budget-overview.webp",
    ],
  },
  home: {
    seo: {
      title: "Event Stories - Free Party Planner App for iPhone",
      description:
        "Plan your perfect event with guest lists, budget tracking, schedules, and vendor management. Export professional PDF reports. Free for iPhone - download now!",
    },
    testimonials: {
      id: "testimonials",
      title: "What Event Planners Say",
      subtitle: "Hear from hosts using Event Stories",
      cards: [
        {
          name: "Emma L.",
          comment:
            "Event Stories made planning my wedding so much easier. The guest list with RSVP tracking was perfect, and I could see exactly where the budget was going with the visual charts.",
        },
        {
          name: "Michael K.",
          comment:
            "I organize corporate events regularly and Event Stories keeps everything in one place. Guest management, vendor contacts, schedules - it's all there. The PDF export is great for sharing with clients.",
        },
        {
          name: "Sarah B.",
          comment:
            "Planned my daughter's birthday party without any stress. The task lists kept me on track, and I loved being able to document everything with photos. Will definitely use it for future events!",
        },
      ],
    },
    partners: {
      title: "",
      logos: [],
    },
    howItWorks: {
      id: "how-it-works",
      title: "How it works",
      subtitle:
        "Plan your perfect event from start to finish with Event Stories",
      steps: [
        {
          title: "Create Your Event",
          subtitle:
            "Set up your event with date, budget, and details to get started planning your celebration.",
          image: "/stock/01.webp",
        },
        {
          title: "Build Your Guest List",
          subtitle:
            "Add guests, track RSVPs, manage dietary requirements, and organize seating arrangements.",
          image: "/stock/02.webp",
        },
        {
          title: "Track Your Budget",
          subtitle:
            "Monitor spending with visual charts showing expenses by category and remaining budget at a glance.",
          image: "/stock/03.webp",
        },
        {
          title: "Coordinate Vendors & Schedule",
          subtitle:
            "Manage vendor contacts, create timelines, and keep your event running smoothly with integrated maps.",
          image: "/stock/04.webp",
        },
        {
          title: "Export & Share",
          subtitle:
            "Generate professional PDF reports with guest lists, budgets, and event details to share with your team.",
          image: "/stock/05.webp",
        },
      ],
    },
    features: {
      id: "features",
      title: "Everything You Need for Your Event",
      subtitle:
        "Plan, organize, and execute memorable events with powerful features",
      cards: [
        {
          title: "Guest List Management",
          subtitle:
            "Track RSVPs, manage contact info, dietary requirements, and plus-ones. Keep your guest list organized and up-to-date.",
          icon: "/icons/budget-tracking.png",
        },
        {
          title: "Budget Tracking",
          subtitle:
            "Visualize expenses by category, track payments to vendors, and stay on top of your event budget with clear charts.",
          icon: "/icons/photo-timeline.png",
        },
        {
          title: "Schedule & Timeline",
          subtitle:
            "Create detailed event schedules with map integration. Coordinate vendors, activities, and keep everything on track.",
          icon: "/icons/task-management.png",
        },
        {
          title: "PDF Export",
          subtitle:
            "Generate professional reports with guest lists, budgets, vendor contacts, and schedules to share with your team.",
          icon: "/icons/pdf-export.png",
        },
      ],
    },
    faq: {
      id: "faq",
      title: "Frequently Asked Questions",
      qa: [
        {
          question: "Is Event Stories free to use?",
          answer:
            "Yes, it's free! We also offer a Premium Lifetime upgrade with more advanced features for serious event planners.",
        },
        {
          question: "Does the app work offline?",
          answer:
            "Absolutely! Event Stories is designed to work fully offline so you can access your events, guest lists, and budgets even without internet access - perfect for venue visits.",
        },
        {
          question: "Can I share events with others?",
          answer:
            "Yes! With iCloud sync your events stay up to date across your devices. You can also export professional PDF reports to share with co-planners, vendors, or your event team.",
        },
        {
          question: "How do I export reports?",
          answer:
            "Simply open your event, tap the export button, and choose PDF. Event Stories generates a professional report with your guest list, budget summary, vendor contacts, and schedule.",
        },
        {
          question: "What devices are supported?",
          answer:
            "Event Stories is currently available for iPhone and requires iOS 17.0 or later. We're focused on delivering the best possible experience on iOS first.",
        },
      ],
    },
    header: {
      headline: "Plan Your Perfect Event",
      subtitle:
        "Event Stories is your complete event planning companion. Manage guest lists, track budgets, coordinate schedules, organize vendors, and document your celebration.",
      screenshots: [
        "/screenshots/projects-list.webp",
        "/screenshots/guest-list.webp",
        "/screenshots/budget-overview.webp",
      ],
      rewards: [],
      usersDescription: "Join event planners organizing memorable celebrations",
      headlineMark: [2, 3],
    },
  },
  privacyPolicy: {
    seo: {
      title: "Privacy Policy - Event Stories",
      description: "Privacy Policy for Event Stories - Party Planner App",
    },
    content: `# Privacy Policy

**Effective Date:** January 2026

## Introduction

Welcome to Event Stories (the "App"). Robert Jensen ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share your personal information when you use our App.

For the full privacy policy, please visit: [https://www.12f.dk/event-stories/privacy-policy/](https://www.12f.dk/event-stories/privacy-policy/)

## Contact Us

If you have any questions or concerns about this Privacy Policy, please contact us at:

Robert Jensen
Adjudantvaenget 12, 3520 Farum, Denmark
robert@12f.dk
+45 29475566

`,
  },
  cookiesPolicy: {
    seo: {
      title: "Cookies Policy - Event Stories",
      description: "Cookies Policy for Event Stories",
    },
    content: `# Cookies Policy

This website does not use cookies for tracking or advertising purposes.

## Contact Us

If you have any questions, please contact us at robert@12f.dk
`,
  },
  termsAndConditions: {
    seo: {
      title: "Terms and Conditions - Event Stories",
      description: "Terms and Conditions for Event Stories - Party Planner App",
    },
    content: `# Terms and Conditions

**Effective Date:** January 2026

## Introduction

Welcome to Event Stories (the "App"). These Terms and Conditions govern your use of the App provided by Robert Jensen ("we," "our," or "us"). By accessing or using our App, you agree to be bound by these Terms.

## Use of the App

### Eligibility
To use our App, you must be at least 4 years old (as per App Store rating).

### User Accounts
You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account.

## Intellectual Property

All content and materials available on the App are the property of Robert Jensen and are protected by intellectual property laws.

## Disclaimers

The App is provided on an "as is" and "as available" basis. We make no warranties about the accuracy or completeness of the content.

## Governing Law

These Terms shall be governed by and construed in accordance with the laws of Denmark.

## Contact Us

If you have any questions about these Terms, please contact us at:

Robert Jensen
Adjudantvaenget 12, 3520 Farum, Denmark
robert@12f.dk
+45 29475566
`,
  },
};

export default templateConfig;
