import clsx from "clsx";
import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { ConfigContext } from "../../../../utils/configContext";
import SectionHeading from "../../../../components/sectionHeading";

function Faq() {
  const {
    home: { faq },
  } = useContext(ConfigContext)!;
  const [activeIndex, setActiveIndex] = useState<number>();

  if (!faq) return null;

  return (
    <section
      id={faq.id}
      className="mx-auto max-w-screen-lg px-4 py-20 md:py-28"
    >
      <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
        <SectionHeading
          label="Before you RSVP"
          title={faq.title}
          subtitle="Everything hosts ask before they start planning."
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="divide-y divide-base-300 border-y border-base-300"
        >
          {faq.qa.map((qa, index) => {
            const open = activeIndex === index;
            return (
              <div key={qa.question}>
                <button
                  onClick={() =>
                    setActiveIndex((current) =>
                      current === index ? undefined : index
                    )
                  }
                  aria-expanded={open}
                  className="flex w-full items-center gap-4 py-5 text-left"
                >
                  <span
                    className={clsx(
                      "font-mono text-sm font-bold tabular-nums transition-colors",
                      open ? "text-foil" : "text-base-content/40"
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-medium text-base-content">
                    {qa.question}
                  </span>
                  <span
                    aria-hidden="true"
                    className={clsx(
                      "text-lg text-base-content/40 transition-transform duration-300",
                      open && "rotate-45 text-foil"
                    )}
                  >
                    +
                  </span>
                </button>
                <div
                  className={clsx(
                    "grid transition-[grid-template-rows] duration-300 ease-out",
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="pb-6 pl-10 pr-8 text-base-content/70">
                      {qa.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

export default Faq;
