import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { motion } from "framer-motion";
import { useContext } from "react";
import { ConfigContext } from "../../../../utils/configContext";
import { Autoplay } from "swiper/modules";
import SectionHeading from "../../../../components/sectionHeading";

function Testimonials() {
  const {
    home: { testimonials },
  } = useContext(ConfigContext)!;
  if (!testimonials) return null;

  return (
    <section className="mx-auto max-w-screen-lg px-4 py-20 md:py-28">
      <SectionHeading
        label="The guest book"
        title={testimonials.title}
        subtitle={testimonials.subtitle}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="mt-12"
      >
        <Swiper
          loop
          autoplay={{ delay: 4200, disableOnInteraction: false }}
          modules={[Autoplay]}
          spaceBetween={24}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          slidesPerView={1}
        >
          {testimonials.cards.map(({ name, comment }) => (
            <SwiperSlide className="my-2 !h-auto" key={name}>
              <figure className="flex h-full flex-col justify-between rounded-box border border-base-300 bg-base-100 p-7">
                <blockquote>
                  <span
                    aria-hidden="true"
                    className="font-display text-5xl leading-none text-foil"
                  >
                    &ldquo;
                  </span>
                  <p className="mt-2 text-base-content/80">{comment}</p>
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-2.5 border-t border-base-300 pt-4">
                  <span aria-hidden="true" className="foil-tick" />
                  <span className="tick-label text-base-content/60">
                    {name}
                  </span>
                </figcaption>
              </figure>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </section>
  );
}

export default Testimonials;
