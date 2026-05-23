import AnimatedText from "../../../../components/animatedText";
import { motion } from "framer-motion";
import { useContext } from "react";
import { ConfigContext } from "../../../../utils/configContext";

function UseCases() {
  const {
    home: { useCases },
  } = useContext(ConfigContext)!;
  if (!useCases) return null;

  return (
    <section id={useCases.id} className="max-w-screen-lg mx-auto px-4 py-12">
      <div className="mb-12 max-w-none flex flex-col items-center prose prose-lg text-center">
        <h2 className="mb-3">
          <AnimatedText text={useCases.title} />
        </h2>
        <motion.div
          className="h-2 bg-gradient-to-r from-primary to-secondary rounded-full overflow-hidden [--w:200px] md:[--w:350px]"
          whileInView={{ width: "var(--w)" }}
          viewport={{ amount: 1, once: true, margin: "0px 0px -100px 0px" }}
        />
        {useCases.subtitle && (
          <motion.p
            initial={{ y: "100%", opacity: 0 }}
            whileInView={{ y: "0%", opacity: 1 }}
            viewport={{ once: true }}
            className="text-md max-w-lg text-base-content"
          >
            {useCases.subtitle}
          </motion.p>
        )}
      </div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6"
      >
        {useCases.cards.map((useCase, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { y: "30%", opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
            transition={{ delay: 0.1 + index * 0.1 }}
            className="shadow-md border-primary/10 border-2 card relative overflow-hidden group p-6"
          >
            <div className="card-body items-center text-center p-0 gap-3">
              <span
                className="text-5xl transition-transform group-hover:scale-110"
                role="img"
                aria-label={useCase.title}
              >
                {useCase.emoji}
              </span>
              <h3 className="card-title text-xl font-bold">{useCase.title}</h3>
              <p className="text-base-content/80">{useCase.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

export default UseCases;
