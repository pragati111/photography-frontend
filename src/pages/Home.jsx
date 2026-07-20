import TopHeader from "../components/TopHeader";
import BottomBar from "../components/BottomBar";
import HomeContent from "../components/HomeContent";

export default function Home() {
  return (
    <div className="md:hidden h-screen overflow-hidden">
      
      <TopHeader />

      {/* SCROLLABLE AREA */}
      <div className="pt-[80px] pb-[80px] h-full overflow-y-auto custom-scrollbar">
        <HomeContent />
      </div>

      <BottomBar />
    </div>
  );
}