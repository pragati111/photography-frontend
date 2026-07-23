import { useEffect } from "react";
import TopHeader from "../components/TopHeader";
import BottomBar from "../components/BottomBar";

export default function FAQPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <TopHeader />

      <div className="w-full lg:w-[calc(100%-240px)] lg:ml-[240px] pt-[80px] bg-gray-100 min-h-screen">
        <div className="px-4 md:px-8 lg:px-10 py-10">
          <h1 className="text-4xl font-bold text-slate-900">FAQ</h1>
          <p className="mt-4 text-gray-600 max-w-3xl leading-relaxed">
            Frequently asked questions will appear here. Build this page out with
            your top questions, answers, and support details.
          </p>
        </div>
      </div>

      <BottomBar />
    </>
  );
}
