import { useContext } from "react";
import { ConfigContext } from "../../utils/configContext";
import { withBase } from "../../utils/basePath";
import IphoneFrame from "../../components/iphoneFrame";
import { motion } from "framer-motion";
import clsx from "clsx";

function AppBanner() {
  const { googlePlayLink, appStoreLink, appBanner } =
    useContext(ConfigContext)!;

  if (!appBanner) return null;
  return (
    <motion.section
      id={appBanner.id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="mx-auto max-w-screen-lg px-4 py-20 md:py-24"
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 24 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-box bg-neutral text-neutral-content"
      >
        {/* A faint place-card dot frame, echoing the hero */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] [background-size:22px_22px]"
        />
        <div className="relative flex flex-col items-center gap-8 p-8 md:flex-row md:gap-4 md:p-12">
          <div className="flex-1">
            <p className="tick-label flex items-center gap-2.5 text-neutral-content/60">
              <span aria-hidden="true" className="foil-tick" />
              The last detail
            </p>
            <h2 className="mb-0 mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tightest md:text-5xl">
              {appBanner.title}
            </h2>
            <p className="mt-4 max-w-lg whitespace-pre-wrap text-neutral-content/75 md:text-lg">
              {appBanner.subtitle}
            </p>
            <ul className="mt-8 flex list-none flex-wrap gap-4 p-0">
              {googlePlayLink && (
                <li className="m-0 p-0">
                  <a href={googlePlayLink}>
                    <img
                      className="h-[52px]"
                      alt="Download on Google Play"
                      src={withBase("/stores/google-play.svg")}
                      width={156}
                      height={52}
                    />
                  </a>
                </li>
              )}
              {appStoreLink && (
                <li className="m-0 p-0">
                  <a href={appStoreLink} target="_blank" rel="noopener noreferrer">
                    <img
                      className="h-[52px]"
                      alt="Download on the App Store"
                      src={withBase("/stores/app-store.svg")}
                      width={156}
                      height={52}
                    />
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div className="relative flex flex-1 justify-center">
            {appBanner.screenshots.map((src, index) => (
              <motion.div
                key={src}
                variants={{
                  hidden: { opacity: 0, y: 20, rotate: 0 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    rotate: index === 0 ? 0 : index === 1 ? "-8deg" : "8deg",
                  },
                }}
                transition={{
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                  delay: index === 0 ? 0.2 : 0.35,
                }}
                className={clsx(
                  "[--iphone-width:230px]",
                  index === 0 && "relative z-20 block",
                  index === 1 &&
                    "absolute bottom-0 right-4 z-10 hidden origin-bottom lg:block",
                  index === 2 &&
                    "absolute bottom-0 left-4 z-10 hidden origin-bottom lg:block"
                )}
              >
                <IphoneFrame src={withBase(src)} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}

export default AppBanner;
