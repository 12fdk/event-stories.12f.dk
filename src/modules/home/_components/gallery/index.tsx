import { motion } from "framer-motion";
import { useContext } from "react";
import { ConfigContext } from "../../../../utils/configContext";
import { withBase } from "../../../../utils/basePath";
import SectionHeading from "../../../../components/sectionHeading";

function Gallery() {
  const {
    home: { gallery },
  } = useContext(ConfigContext)!;
  if (!gallery) return null;

  return (
    <section
      id={gallery.id}
      className="border-y border-base-300 bg-base-200/60 overflow-hidden"
    >
      <div className="mx-auto max-w-screen-lg px-4 py-20 md:py-28">
        <SectionHeading
          label="A closer look"
          title={gallery.title}
          subtitle={gallery.subtitle}
        />

        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
          {gallery.images.map((image, index) => {
            const mobileSrc = image.src.replace(/\.webp$/, "-mobile.webp");
            return (
              <motion.figure
                key={image.src}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: (index % 5) * 0.07,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="m-0 flex flex-col gap-3"
              >
                <div className="relative aspect-[9/16] w-full overflow-hidden rounded-xl bg-base-300 shadow-lg ring-1 ring-base-content/10">
                  <img
                    src={withBase(image.src)}
                    srcSet={`${withBase(mobileSrc)} 220w, ${withBase(image.src)} 1206w`}
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 340px"
                    alt={image.caption}
                    className="absolute inset-0 h-full w-full object-cover object-top"
                    loading="lazy"
                    decoding="async"
                    width={200}
                    height={430}
                  />
                </div>
                <figcaption className="flex items-start gap-2 text-sm text-base-content/70">
                  <span
                    aria-hidden="true"
                    className="foil-tick mt-[0.3rem]"
                  />
                  {image.caption}
                </figcaption>
              </motion.figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Gallery;
