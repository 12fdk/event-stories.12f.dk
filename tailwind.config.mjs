import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    screens: {
      "3xs": "350px",
      "2xs": "400px",
      xs: "475px",
      ...defaultTheme.screens,
    },
    extend: {
      fontFamily: {
        // Fraunces: warm high-contrast serif, the invitation face — display only
        display: ["Fraunces", "Georgia", ...defaultTheme.fontFamily.serif],
        sans: ["Inter", "SF Pro Text", ...defaultTheme.fontFamily.sans],
        // Space Mono: run-of-show timestamps, labels, figures
        mono: ["Space Mono", ...defaultTheme.fontFamily.mono],
      },
      letterSpacing: {
        tightest: "-0.035em",
        label: "0.18em",
      },
      colors: {
        // The one signature colour: champagne foil, reserved for the programme
        foil: "#C08A2D",
      },
      keyframes: {
        "draw-in": {
          from: { transform: "scaleY(0)" },
          to: { transform: "scaleY(1)" },
        },
      },
      animation: {
        "draw-in": "draw-in 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both",
      },
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
  daisyui: {
    themes: [
      // "Letterpress" — invitation stock and plum ink, raspberry rose for
      // actions, champagne foil reserved for the run-of-show programme.
      {
        home: {
          primary: "#C0304F",
          "primary-content": "#FDF8F0",
          secondary: "#6B4A8F",
          "secondary-content": "#FDF8F0",
          accent: "#C08A2D",
          "accent-content": "#241C2C",
          neutral: "#241C2C",
          "neutral-content": "#FBF7EF",
          "base-100": "#FBF7EF",
          "base-200": "#F1E7D6",
          "base-300": "#E4D6BF",
          "base-content": "#241C2C",
          info: "#6B4A8F",
          success: "#3F7A5C",
          warning: "#C08A2D",
          error: "#C0304F",
          "--rounded-box": "0.5rem",
          "--rounded-btn": "0.375rem",
          "--rounded-badge": "0.25rem",
          "--animation-btn": "0.2s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.98",
          "--border-btn": "0px",
        },
      },
      // Dark: evening reception — deep plum ink, warmed foil and rose
      {
        "home-dark": {
          primary: "#E86A82",
          "primary-content": "#1A121F",
          secondary: "#B18AD6",
          "secondary-content": "#1A121F",
          accent: "#E0B24B",
          "accent-content": "#1A121F",
          neutral: "#221A2B",
          "neutral-content": "#F4ECE0",
          "base-100": "#17121D",
          "base-200": "#211A29",
          "base-300": "#332941",
          "base-content": "#F4ECE0",
          info: "#B18AD6",
          success: "#5FB98C",
          warning: "#E0B24B",
          error: "#E86A82",
          "--rounded-box": "0.5rem",
          "--rounded-btn": "0.375rem",
          "--rounded-badge": "0.25rem",
          "--animation-btn": "0.2s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.98",
          "--border-btn": "0px",
        },
      },
    ],
  },
};
