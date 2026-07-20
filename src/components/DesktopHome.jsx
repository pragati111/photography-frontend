import { useState } from "react";
import { categories } from "../data/categories";
import TopHeader from "./TopHeader";
import BottomBar from "./BottomBar";
import { ChevronDown } from "lucide-react";
import HomeContent from "./HomeContent";
import Sidebar from "./SideBar";

export default function DesktopHome() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="font-sans">
      <TopHeader />

      <div className="flex">
        {/* 🔥 ULTRA COMPACT SIDEBAR */}
        <Sidebar />

        {/* 🔥 MAIN CONTENT (FULL WIDTH NOW) */}
        <div className="w-full lg:w-[calc(100%-240px)] lg:ml-[240px] pt-[120px]">
          <HomeContent/>
        </div>
      </div>

      <BottomBar />
    </div>
  );
}
