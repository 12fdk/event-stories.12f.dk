import { useContext } from "react";
import { ConfigContext } from "../../utils/configContext";
import InstagramLogo from "./svgs/instagram";
import FacebookLogo from "./svgs/facebook";
import TwitterLogo from "./svgs/twitter";
import { withBase } from "../../utils/basePath";
import { motion } from "framer-motion";

function Footer() {
  const {
    name,
    logo,
    footer: { links, legalLinks, socials },
  } = useContext(ConfigContext)!;

  const legal = [
    legalLinks.termsAndConditions && {
      title: "Terms & conditions",
      href: "/terms-and-conditions",
    },
    legalLinks.privacyPolicy && {
      title: "Privacy policy",
      href: "/privacy-policy",
    },
    legalLinks.cookiesPolicy && {
      title: "Cookies policy",
      href: "/cookies-policy",
    },
  ].filter(Boolean) as { title: string; href: string }[];

  return (
    <footer className="border-t border-base-300 bg-base-200/60 px-4 pb-12 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-screen-lg"
      >
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-xs">
            <a href="/" className="flex items-center gap-2">
              <img
                className="h-10 rounded-[22%]"
                src={withBase(logo)}
                alt={`${name} logo`}
                width={40}
                height={40}
              />
              <span className="font-display text-xl font-semibold tracking-tight">
                {name}
              </span>
            </a>
            <p className="mt-4 text-sm text-base-content/60">
              The party planner that keeps every guest, every euro, and every
              moment in one place.
            </p>
            {(socials?.facebook || socials?.instagram || socials?.twitter) && (
              <div className="mt-5 flex items-center gap-3 text-base-content/70">
                {socials?.facebook && (
                  <a className="h-8 w-8 hover:text-primary" target="_blank" href={socials.facebook}>
                    <FacebookLogo />
                  </a>
                )}
                {socials?.instagram && (
                  <a className="h-8 w-8 hover:text-primary" target="_blank" href={socials.instagram}>
                    <InstagramLogo />
                  </a>
                )}
                {socials?.twitter && (
                  <a className="h-8 w-8 hover:text-primary" target="_blank" href={socials.twitter}>
                    <TwitterLogo />
                  </a>
                )}
              </div>
            )}
          </div>

          <nav className="flex flex-col gap-3">
            <p className="tick-label text-base-content/45">On this page</p>
            {links.map(({ title, href }) => (
              <a
                key={href}
                className="w-fit text-base-content/75 transition-colors hover:text-primary"
                href={href}
              >
                {title}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-base-300 pt-6 text-sm text-base-content/55 sm:flex-row sm:items-center">
          <p className="m-0">
            All rights reserved © {new Date().getFullYear()} {name}
          </p>
          {legal.length > 0 && (
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {legal.map(({ title, href }) => (
                <a
                  key={href}
                  className="hover:text-primary"
                  href={href}
                >
                  {title}
                </a>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </footer>
  );
}

export default Footer;
