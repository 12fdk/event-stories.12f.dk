import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import AppBanner from "../../components/appBanner";
import { ConfigContext } from "../../utils/configContext";
import type { TemplateConfig } from "../../utils/configType";
import Header from "./_components/header";
import Features from "./_components/features";
import UseCases from "./_components/useCases";
import Gallery from "./_components/gallery";
import Faq from "./_components/faq";
import HowItWorks from "./_components/howItWorks";
import Testimonials from "./_components/testimonials";
import StickyDownload from "../../components/stickyDownload";
import SectionCta from "../../components/sectionCta";

interface Props {
  config: TemplateConfig;
}

function Home({ config }: Props) {
  return (
    <ConfigContext.Provider value={config}>
      <main>
        <Navbar />
        <Header />
        <Features />
        <UseCases />
        <SectionCta text="Ready to plan your perfect event?" variant="minimal" />
        <HowItWorks />
        <Gallery />
        <SectionCta text="Join event planners organizing memorable celebrations" variant="minimal" />
        <Testimonials />
        <Faq />
        <AppBanner />
        <Footer />
        <StickyDownload />
      </main>
    </ConfigContext.Provider>
  );
}

export default Home;
