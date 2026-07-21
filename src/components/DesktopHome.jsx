import TopNavbar from "./TopNavbar";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import IconicImagesSection from "./IconicImagesSection";
import PhotographyBlogSection from "./PhotographyBlogSection";

export default function DesktopHome() {
  return (
    <div className="font-sans">
      <HeroSection>
        <TopNavbar />
      </HeroSection>
      <AboutSection />
      <IconicImagesSection />
      <PhotographyBlogSection/>
    </div>
  );
}