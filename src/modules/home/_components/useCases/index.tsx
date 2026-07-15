import { motion } from "framer-motion";
import { useContext } from "react";
import { ConfigContext } from "../../../../utils/configContext";
import SectionHeading from "../../../../components/sectionHeading";

function UseCases() {
  const {
    home: { useCases },
  } = useContext(ConfigContext)!;
  if (!useCases) return null;

  return (
    <section
      id={useCases.id}
      className="border-y border-base-300 bg-base-200/60"
    >
      <div className="mx-auto max-w-screen-lg px-4 py-20 md:py-28">
        <SectionHeading
          label="On the guest list"
          title={useCases.title}
          subtitle={useCases.subtitle}
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.cards.map((useCase, index) => (
            <motion.article
              key={useCase.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.5,
                delay: (index % 3) * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative overflow-hidden rounded-box border border-base-300 bg-base-100 p-6"
            >
              {/* A place-card top edge in foil */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-foil transition-transform duration-500 ease-out group-hover:scale-x-100"
              />
              <span
                className="text-4xl"
                role="img"
                aria-label={useCase.title}
              >
                {useCase.emoji}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-base-content">
                {useCase.title}
              </h3>
              <p className="mt-2 text-base-content/70">{useCase.subtitle}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default UseCases;
