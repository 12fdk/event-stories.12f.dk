import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { ConfigContext } from "../../../../utils/configContext";
import { withBase } from "../../../../utils/basePath";
import AppStoreRating from "../../../../components/appStoreRating";

const SCREENSHOT_INTERVAL = 3800;

/**
 * The signature: a run-of-show. An event lives in memory as an order of
 * moments, and this is how the app holds them — a printed programme with
 * mono timestamps down a hanging spine, each moment marked with a foil tick.
 * The sample below is one evening's order of events, not a real reservation.
 */
function RunOfShow({
  title,
  caption,
  items,
}: {
  title: string;
  caption?: string | undefined;
  items: { time: string; title: string; note?: string | undefined }[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="not-prose mt-9 max-w-md rounded-box border border-base-300 bg-base-100/70 p-5 backdrop-blur-sm sm:p-6"
    >
      <div className="flex items-baseline justify-between">
        <span className="tick-label text-base-content/55">{title}</span>
        {caption && (
          <span className="tick-label text-foil">{caption}</span>
        )}
      </div>

      <ol className="relative mt-5 list-none space-y-4 pl-0">
        {/* The hanging spine the moments are pinned to */}
        <span
          aria-hidden="true"
          className="programme-spine absolute bottom-2 left-[3px] top-2 text-base-content"
        />
        {items.map((item, index) => (
          <motion.li
            key={item.time}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 + index * 0.12 }}
            className="relative flex items-baseline gap-4 pl-6"
          >
            <span
              aria-hidden="true"
              className="foil-tick absolute left-0 top-[0.45rem]"
            />
            <time className="w-12 flex-none font-mono text-sm font-bold tabular-nums text-base-content">
              {item.time}
            </time>
            <span className="text-[0.95rem] leading-snug text-base-content">
              {item.title}
              {item.note && (
                <span className="text-base-content/50"> · {item.note}</span>
              )}
            </span>
          </motion.li>
        ))}
      </ol>
    </motion.div>
  );
}

function Header() {
  const {
    googlePlayLink,
    appStoreLink,
    home: { header },
  } = useContext(ConfigContext)!;

  const [index, setIndex] = useState(0);
  const shots = header.screenshots;

  useEffect(() => {
    if (shots.length < 2) return;
    const timer = setInterval(
      () => setIndex((current) => (current + 1) % shots.length),
      SCREENSHOT_INTERVAL
    );
    return () => clearInterval(timer);
  }, [shots.length]);

  const words = header.headline.split(" ");
  const mark = header.headlineMark;

  return (
    <section
      id={header.id}
      className="relative overflow-hidden border-b border-base-300"
    >
      {/* A faint place-card frame line, barely there */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04] [background-image:radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] [background-size:22px_22px]"
      />

      <div className="mx-auto grid max-w-screen-lg gap-12 px-4 pb-16 pt-8 md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-10 md:pb-24 md:pt-12">
        <div className="prose max-w-none">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="tick-label not-prose m-0 flex items-center gap-2.5 text-base-content/55"
          >
            <span aria-hidden="true" className="foil-tick" />
            {header.eyebrow ?? "Party planner for iPhone"}
          </motion.p>

          <h1 className="mb-0 mt-5 font-display text-[2.6rem] font-semibold leading-[1.02] tracking-tightest md:text-[3.75rem]">
            {words.map((word, wordIndex) => {
              const highlighted =
                mark && wordIndex >= mark[0] && wordIndex < mark[1];
              return (
                <motion.span
                  key={wordIndex}
                  initial={{ opacity: 0, y: "0.35em" }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.07 * wordIndex,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    marginRight: wordIndex < words.length - 1 ? "0.24em" : 0,
                  }}
                  className={highlighted ? "relative inline-block" : "inline-block"}
                >
                  {highlighted ? (
                    <span className="italic text-primary">{word}</span>
                  ) : (
                    word
                  )}
                  {highlighted && (
                    <motion.span
                      aria-hidden="true"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.85, duration: 0.5 }}
                      style={{ transformOrigin: "left" }}
                      className="absolute -bottom-1 left-0 right-0 h-[3px] bg-foil"
                    />
                  )}
                </motion.span>
              );
            })}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mb-0 mt-6 max-w-lg text-base leading-relaxed text-base-content/75 md:text-lg"
          >
            {header.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="not-prose mt-8 flex flex-wrap items-center gap-x-5 gap-y-4"
          >
            {appStoreLink && (
              <a
                href={appStoreLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <img
                  className="h-[52px]"
                  alt="Download Event Stories on the App Store"
                  src={withBase("/stores/app-store.svg")}
                  width={156}
                  height={52}
                />
              </a>
            )}
            {googlePlayLink && (
              <a href={googlePlayLink} className="inline-flex">
                <img
                  className="h-[52px]"
                  alt="Get Event Stories on Google Play"
                  src={withBase("/stores/google-play.svg")}
                  width={156}
                  height={52}
                />
              </a>
            )}
            <AppStoreRating size="md" showReviewCount={false} />
          </motion.div>

          {header.usersDescription && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="not-prose mt-4 text-sm text-base-content/55"
            >
              {header.usersDescription}
            </motion.p>
          )}

          {header.programme && <RunOfShow {...header.programme} />}
        </div>

        {/* The real thing */}
        <div className="flex justify-center md:justify-end">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="iphone-frame"
          >
            <div className="iphone-device">
              <div className="iphone-dynamic-island" />
              <div className="iphone-screen">
                {shots.map((src, shotIndex) => (
                  <img
                    key={src}
                    src={withBase(src)}
                    alt={`Event Stories on iPhone, screen ${shotIndex + 1}`}
                    className="iphone-screenshot absolute inset-0 transition-opacity duration-700"
                    style={{ opacity: shotIndex === index ? 1 : 0 }}
                    width={288}
                    height={624}
                    loading={shotIndex === 0 ? "eager" : "lazy"}
                    fetchPriority={shotIndex === 0 ? "high" : "auto"}
                  />
                ))}
              </div>
              <div className="iphone-button-left iphone-button-silent" />
              <div className="iphone-button-left iphone-button-volume-up" />
              <div className="iphone-button-left iphone-button-volume-down" />
              <div className="iphone-button-right iphone-button-power" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Header;
