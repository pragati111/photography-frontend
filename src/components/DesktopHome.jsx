import TopNavbar from "./TopNavbar";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import IconicImagesSection from "./IconicImagesSection";
import PhotographyBlogSection from "./PhotographyBlogSection";
import AwardSection from "./AwardSection";
import VideoSection from "./VideoSection";
import PremiumCarousel from "./PremiumCarousel";

export default function DesktopHome() {
  return (
    <div className="font-sans">
      <HeroSection>
        <TopNavbar />
      </HeroSection>
      <AboutSection />
      <IconicImagesSection />
      <PhotographyBlogSection />
      <VideoSection />
      <AwardSection />
      <div className="mt-16 lg:mt-24">
        <PremiumCarousel />
      </div>
    </div>
  );
}