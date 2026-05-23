import AnimatedText from "../../../../components/animatedText";
import { motion } from "framer-motion";
import { useContext } from "react";
import { ConfigContext } from "../../../../utils/configContext";
import { withBase } from "../../../../utils/basePath";

function Gallery() {
  const {
    home: { gallery },
  } = useContext(ConfigContext)!;
  if (!gallery) return null;

  return (
    <section
      id={gallery.id}
      className="py-16 md:py-24 bg-base-200/50 overflow-hidden"
    >
      <div className="max-w-screen-lg mx-auto px-4">
        <div className="mb-12 max-w-none flex flex-col items-center prose prose-lg text-center">
          <h2 className="mb-3">
            <AnimatedText text={gallery.title} />
          </h2>
          {gallery.subtitle && (
            <motion.p
              initial={{ y: "100%", opacity: 0 }}
              whileInView={{ y: "0%", opacity: 1 }}
              viewport={{ once: true }}
              className="text-md max-w-lg text-base-content"
            >
              {gallery.subtitle}
            </motion.p>
          )}
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4"
        >
          {gallery.images.map((image, index) => {
            const mobileSrc = image.src.replace(/\.webp$/, "-mobile.webp");
            return (
              <motion.figure
                key={index}
                variants={{
                  hidden: { y: "20%", opacity: 0 },
                  visible: { y: 0, opacity: 1 },
                }}
                transition={{ delay: 0.05 + (index % 4) * 0.1 }}
                className="flex flex-col items-center gap-3 m-0"
              >
                <div className="relative aspect-[9/16] w-full rounded-2xl overflow-hidden shadow-xl bg-base-300 ring-1 ring-base-content/10">
                  <img
                    src={withBase(image.src)}
                    srcSet={`${withBase(mobileSrc)} 480w, ${withBase(image.src)} 1206w`}
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px"
                    alt={image.caption}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                    loading="lazy"
                    decoding="async"
                    width={240}
                    height={520}
                  />
                </div>
                <figcaption className="text-sm text-center text-base-content/70 font-medium">
                  {image.caption}
                </figcaption>
              </motion.figure>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

export default Gallery;
