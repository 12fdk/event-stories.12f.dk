import { motion } from "framer-motion";
import { useContext } from "react";
import { ConfigContext } from "../../utils/configContext";

interface Props {
  text?: string;
  variant?: "default" | "minimal";
}

function AppleGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function SectionCta({ text = "Ready to plan your event?", variant = "default" }: Props) {
  const { appStoreLink } = useContext(ConfigContext)!;

  if (!appStoreLink) return null;

  if (variant === "minimal") {
    return (
      <div className="mx-auto max-w-screen-lg px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          className="flex flex-col items-center justify-between gap-5 border-y border-base-300 py-8 sm:flex-row"
        >
          <p className="flex items-center gap-2.5 text-center sm:text-left">
            <span aria-hidden="true" className="foil-tick" />
            <span className="font-display text-lg font-medium text-base-content md:text-xl">
              {text}
            </span>
          </p>
          <a
            href={appStoreLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary gap-2"
          >
            <AppleGlyph className="h-5 w-5" />
            Download free
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center gap-4 px-4 py-12"
    >
      <p className="text-center text-lg text-base-content/70">{text}</p>
      <a
        href={appStoreLink}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-primary btn-lg gap-2"
      >
        <AppleGlyph className="h-6 w-6" />
        Download free on the App Store
      </a>
    </motion.div>
  );
}

export default SectionCta;
