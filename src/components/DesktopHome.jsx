import TopNavbar from "./TopNavbar";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import IconicImagesSection from "./IconicImagesSection";
import PhotographyBlogSection from "./PhotographyBlogSection";
import AwardSection from "./AwardSection";
import VideoSection from "./VideoSection";
import PremiumCarousel from "./PremiumCarousel";
import FAQsection from "./FAQsection";
import PremiumFooter from "./PremiumFooter";

export default function DesktopHome() {
  return (
    <div className="font-sans">
      <HeroSection>
        <TopNavbar />
      </HeroSection>
      <AboutSection />
      <div className="mt-12 lg:mt-16">
        <IconicImagesSection />
      </div>
      <PhotographyBlogSection />
      <VideoSection />
      <AwardSection />
      <div className="mt-16 lg:mt-24">
        <PremiumCarousel />
      </div>
      <FAQsection />
      <PremiumFooter/>
    </div>
  );
}