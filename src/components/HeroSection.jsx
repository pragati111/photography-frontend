import React from "react";
import ImageCarousel from "./ImageCarousel";
import { useNavigate } from "react-router-dom";
export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <div className="w-full flex justify-center px-3 md:px-6 lg:px-10 py-6">
      <div
        className="relative w-full max-w-[1400px] min-h-[300px] md:h-[380px] lg:h-[380px] rounded-[36px] overflow-hidden

        backdrop-blur-2xl
        bg-gradient-to-br from-pink-200/40 via-orange-200/30 via-slate-100/40 to-blue-200/40

        border border-white/30
        shadow-[0_20px_60px_rgba(0,0,0,0.10)]

        flex flex-col md:flex-row items-center justify-between
        px-6 md:px-20 py-8 md:py-0 gap-8 md:gap-0"
      >
        {/* RIGHT SECTION */}
        <div className="order-1 md:order-2 relative w-[200px] sm:w-[240px] md:w-[340px] lg:w-[400px] mx-auto md:mx-0 flex items-center justify-center">
          <ImageCarousel />
        </div>

        <div className="order-2 md:order-1 max-w-[100%] md:max-w-[420px] text-center md:text-left">
          <div className="relative pl-5 md:pl-6">
            {/* Continuous Red Line */}
            <div className="absolute left-0 top-0 h-full w-[2px] bg-red-400 rounded-full" />

            {/* CONTENT */}
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-2xl font-semibold text-black leading-tight">
                Custom Prints <br className="hidden sm:block" /> That Stand Out
              </h1>

              <p className="text-sm md:text-lg text-gray-600 mt-1">
                Designed for Your Brand & Style
              </p>

              <p className="text-[11px] md:text-sm text-gray-500 mt-3 leading-relaxed max-w-[300px]">
                From visiting cards and pens to photo frames and home decor, we
                craft personalized prints that leave a lasting impression.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-5">
            <button
              onClick={() => navigate("/categories")}
              className="bg-red-500 text-white px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm shadow-sm hover:scale-105 transition"
            >
              Explore Products
            </button>

            <button
              onClick={() => navigate("/contact")}
              className="bg-white/70 backdrop-blur-md text-gray-700 px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm shadow-sm hover:scale-105 transition"
            >
              Contact Us
            </button>
          </div>

          <div className="mt-5 text-xs md:text-sm text-gray-600 text-center md:text-left">
            <span className="font-medium">Fast Delivery</span>
            <span
              onClick={() => navigate("/about")}
              className="ml-2 text-[10px] md:text-xs text-gray-400 cursor-pointer  transition"
            >
              Premium Quality Prints →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
