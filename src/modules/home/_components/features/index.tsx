import { motion } from "framer-motion";
import { useContext } from "react";
import { ConfigContext } from "../../../../utils/configContext";
import SectionHeading from "../../../../components/sectionHeading";

function Features() {
  const {
    home: { features },
  } = useContext(ConfigContext)!;
  if (!features) return null;

  return (
    <section
      id={features.id}
      className="mx-auto max-w-screen-lg px-4 py-20 md:py-28"
    >
      <SectionHeading
        label="The suite"
        title={features.title}
        subtitle={features.subtitle}
      />

      <div className="mt-14 grid gap-px overflow-hidden rounded-box border border-base-300 bg-base-300 sm:grid-cols-2">
        {features.cards.map((feat, index) => (
          <motion.article
            key={feat.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.5,
              delay: (index % 2) * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="group flex flex-col gap-4 bg-base-100 p-7 md:p-9"
          >
            <div className="flex items-center justify-between">
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-2xl ring-1 ring-accent/25 transition-transform duration-300 group-hover:-rotate-6"
                role="img"
                aria-label={feat.title}
              >
                {feat.emoji}
              </span>
              <span className="tick-label text-base-content/35">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold tracking-tight text-base-content md:text-2xl">
                {feat.title}
              </h3>
              <p className="mt-2 text-base-content/70">{feat.subtitle}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export default Features;
