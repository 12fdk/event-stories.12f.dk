import { MotionConfig } from "framer-motion";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import AppBanner from "../../components/appBanner";
import { ConfigContext } from "../../utils/configContext";
import type { TemplateConfig } from "../../utils/configType";
import type { BlogTeaser } from "../../content/blog";
import Header from "./_components/header";
import Features from "./_components/features";
import UseCases from "./_components/useCases";
import Gallery from "./_components/gallery";
import Faq from "./_components/faq";
import HowItWorks from "./_components/howItWorks";
import Testimonials from "./_components/testimonials";
import WritingSection from "./_components/writing";
import StickyDownload from "../../components/stickyDownload";
import SectionCta from "../../components/sectionCta";

interface Props {
  config: TemplateConfig;
  posts?: BlogTeaser[];
}

function Home({ config, posts = [] }: Props) {
  return (
    <ConfigContext.Provider value={config}>
      <MotionConfig reducedMotion="user">
        <Navbar />
        <Header />
        <Features />
        <UseCases />
        <SectionCta text="Ready to plan your perfect event?" variant="minimal" />
        <HowItWorks />
        <Gallery />
        <SectionCta text="Join event planners organizing memorable celebrations" variant="minimal" />
        <Testimonials />
        <WritingSection posts={posts} />
        <Faq />
        <AppBanner />
        <Footer />
        <StickyDownload />
      </MotionConfig>
    </ConfigContext.Provider>
  );
}

export default Home;