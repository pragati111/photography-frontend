import React from "react";

export default function MarketingSection() {
  return (
    <div className="px-4 md:px-8 lg:px-12 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* --- LEFT CONTAINER (POS Shelf Display) --- */}
        <div className="relative group overflow-hidden rounded-xl bg-[#f5e6d3] flex items-center min-h-[400px]">
          {/* Background Image/Graphics */}
          <div className="absolute inset-0 flex items-center justify-between p-6 md:p-12">
            <div className="w-1/2 z-10">
              <h3 className="text-sm md:text-lg font-medium text-gray-700">
                Transform Your Sales with
              </h3>
              <h2 className="text-2xl md:text-4xl font-black text-black leading-tight uppercase">
                POS Shelf Display
              </h2>
              <p className="mt-2 text-sm md:text-lg text-gray-600 italic">
                Where Innovation Meets Visibility!
              </p>
              <button className="mt-6 bg-[#eb4d27] text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-orange-700 transition-colors">
                DISCOVER <span className="text-xl">→</span>
              </button>
            </div>

            {/* Display Stands Placeholder */}
            <div className="w-1/2 flex justify-end">
              {/* Replace with your actual image */}
              <img
                src="images/1.jpg"
                alt="POS Displays"
                className="max-h-[300px] object-contain"
              />
            </div>
          </div>
        </div>

        {/* --- RIGHT CONTAINERS (Stacked) --- */}
        <div className="flex flex-col gap-4">
          {/* TOP RIGHT: Signages */}
          {/* Changed h-[220px] to h-[130px] lg:h-[220px] */}
          <div className="relative h-[130px] lg:h-[220px] rounded-xl overflow-hidden group cursor-pointer">
            <img
              src="images/3.jpg"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              alt="Signages"
            />
            <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
              <div className="bg-white/80 backdrop-blur-sm px-4 py-2 lg:px-8 lg:py-4 text-center shadow-lg">
                <h3 className="text-sm lg:text-2xl font-black text-black tracking-widest uppercase">
                  Signages
                </h3>
                <p className="text-[10px] lg:text-xs font-bold flex items-center justify-center gap-1">
                  EXPLORE <span>→</span>
                </p>
              </div>
            </div>
          </div>

          {/* BOTTOM RIGHT: Neon Signages */}
          {/* Changed h-[220px] to h-[130px] lg:h-[220px] */}
          <div className="relative h-[130px] lg:h-[220px] rounded-xl overflow-hidden group cursor-pointer">
            <img
              src="images/4.jpg"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              alt="Neon Signages"
            />
            <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
              <div className="bg-white/80 backdrop-blur-sm px-4 py-2 lg:px-8 lg:py-4 text-center shadow-lg">
                <h3 className="text-sm lg:text-2xl font-black text-black tracking-widest uppercase">
                  Neon Signages
                </h3>
                <p className="text-[10px] lg:text-xs font-bold flex items-center justify-center gap-1">
                  EXPLORE <span>→</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
