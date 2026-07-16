import { MotionConfig } from "framer-motion";
import Navbar from "../navbar";
import Footer from "../footer";
import { ConfigContext } from "../../utils/configContext";
import type { TemplateConfig } from "../../utils/configType";

interface Props {
  config: TemplateConfig;
}

// Shared navigation island for pages that render their content as plain Astro
// markup (blog listing, blog posts) rather than through a React page module.
// The Navbar/Footer read from ConfigContext, so each island provides it.

export function SiteNavbar({ config }: Props) {
  return (
    <ConfigContext.Provider value={config}>
      <MotionConfig reducedMotion="user">
        <Navbar />
      </MotionConfig>
    </ConfigContext.Provider>
  );
}

export function SiteFooter({ config }: Props) {
  return (
    <ConfigContext.Provider value={config}>
      <MotionConfig reducedMotion="user">
        <Footer />
      </MotionConfig>
    </ConfigContext.Provider>
  );
}
