import TopNavbar from "./TopNavbar";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import IconicImagesSection from "./IconicImagesSection";
import PhotographyBlogSection from "./PhotographyBlogSection";
import AwardSection from "./AwardSection";
import VideoSection from "./VideoSection";
import WeddingFilmsSection from "./WeddingFilmsFolder/WeddingFilmsSection";

export default function DesktopHome() {
  return (
    <div className="font-sans">
      <HeroSection>
        <TopNavbar />
      </HeroSection>
      <AboutSection />
      <IconicImagesSection />
      <PhotographyBlogSection/>
      <VideoSection/>
      <AwardSection />
      <WeddingFilmsSection />
    </div>
  );
}