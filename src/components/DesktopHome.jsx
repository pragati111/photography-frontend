import TopNavbar from "./TopNavbar";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";

export default function DesktopHome() {
  return (
    <div className="font-sans">
      <HeroSection>
        <TopNavbar />
      </HeroSection>
      <AboutSection />
    </div>
  );
}