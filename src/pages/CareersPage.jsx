import { useEffect } from "react";
import TopHeader from "../components/TopHeader";
import BottomBar from "../components/BottomBar";

export default function CareersPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <TopHeader />

      <div className="w-full lg:w-[calc(100%-240px)] lg:ml-[240px] pt-[80px] bg-gray-100 min-h-screen">
        <div className="px-4 md:px-8 lg:px-10 py-10">
          <h1 className="text-4xl font-bold text-slate-900">Careers</h1>
          <p className="mt-4 text-gray-600 max-w-3xl leading-relaxed">
            Join our team and build creative experiences together. Add career
            opportunities, internship details, and application instructions here.
          </p>
        </div>
      </div>

      <BottomBar />
    </>
  );
}
