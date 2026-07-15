import { motion } from "framer-motion";
import clsx from "clsx";
import { useContext } from "react";
import { ConfigContext } from "../../../../utils/configContext";
import { withBase } from "../../../../utils/basePath";
import IphoneFrame from "../../../../components/iphoneFrame";
import SectionHeading from "../../../../components/sectionHeading";

function HowItWorks() {
  const {
    home: { howItWorks },
  } = useContext(ConfigContext)!;
  if (!howItWorks) return null;

  return (
    <section
      id={howItWorks.id}
      className="mx-auto max-w-screen-lg overflow-hidden px-4 py-20 md:py-28"
    >
      <SectionHeading
        label="Order of the day"
        title={howItWorks.title}
        subtitle={howItWorks.subtitle}
      />

      {/* The run-of-show, at full size: a hanging spine, one moment per step */}
      <ol className="relative mt-16 list-none space-y-16 pl-0 md:space-y-24">
        <span
          aria-hidden="true"
          className="programme-spine absolute bottom-4 left-[10px] top-4 text-base-content md:left-1/2"
        />
        {howItWorks.steps.map((step, index) => (
          <motion.li
            key={step.title}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className={clsx(
              "relative grid items-center gap-8 pl-10 md:grid-cols-2 md:gap-14 md:pl-0",
              { "md:[direction:rtl]": index % 2 === 1 }
            )}
          >
            {/* The foil tick pinning this moment to the spine */}
            <span
              aria-hidden="true"
              className="foil-tick absolute left-[6px] top-2 md:left-1/2 md:-translate-x-1/2"
            />

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="[direction:ltr] md:px-8"
            >
              <div className="tick-label text-foil">
                Step {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-base-content md:text-3xl">
                {step.title}
              </h3>
              <p className="mt-3 max-w-md text-base-content/70">
                {step.subtitle}
              </p>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.92 },
                visible: { opacity: 1, scale: 1 },
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex justify-center [direction:ltr]"
            >
              <IphoneFrame
                src={withBase(step.image)}
                alt={step.title}
                className="[--iphone-width:220px] sm:[--iphone-width:240px]"
              />
            </motion.div>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}

export default HowItWorks;
