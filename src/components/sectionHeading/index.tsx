import { motion } from "framer-motion";

interface Props {
  /** Mono eyebrow. Names the section, the way a line on a programme is titled. */
  label: string;
  title: string;
  subtitle?: string | undefined;
  /** Center the heading (used on full-width sections). */
  centered?: boolean;
  /** Dark sections invert the muted text. */
  inverted?: boolean;
}

/**
 * Every section opens the same way: a foil tick and a mono label, then the
 * Fraunces title. The tick is the mark that names a moment on the programme.
 */
function SectionHeading({
  label,
  title,
  subtitle,
  centered = false,
  inverted = false,
}: Props) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`max-w-2xl ${centered ? "mx-auto text-center" : ""}`}
    >
      <p
        className={`tick-label m-0 flex items-center gap-2.5 ${
          centered ? "justify-center" : ""
        } ${inverted ? "text-neutral-content/60" : "text-base-content/55"}`}
      >
        <span aria-hidden="true" className="foil-tick" />
        {label}
      </p>
      <h2
        className={`mt-4 font-display text-[2rem] font-semibold leading-[1.08] tracking-tightest md:text-[2.75rem] ${
          inverted ? "text-neutral-content" : "text-base-content"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-base leading-relaxed md:text-lg ${
            centered ? "mx-auto max-w-xl" : "max-w-xl"
          } ${inverted ? "text-neutral-content/70" : "text-base-content/70"}`}
        >
          {subtitle}
        </p>
      )}
    </motion.header>
  );
}

export default SectionHeading;
