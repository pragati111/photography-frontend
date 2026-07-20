import React, { useEffect } from "react";
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  Headphones,
  Star,
  Users,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import TopHeader from "./TopHeader";
import PremiumFooter from "./PremiumFooter";
import Sidebar from "./SideBar";
import BottomBar from "./BottomBar";

const features = [
  {
    icon: <Truck size={28} />,
    title: "Fast Delivery",
    desc: "Quick and secure delivery of your custom printed products.",
  },
  {
    icon: <ShieldCheck size={28} />,
    title: "Premium Print Quality",
    desc: "Sharp colors, durable materials, and professional finishing.",
  },
  {
    icon: <Headphones size={28} />,
    title: "Personalized Support",
    desc: "We help you customize products exactly the way you want.",
  },
  {
    icon: <Sparkles size={28} />,
    title: "Unique Gift Collection",
    desc: "Creative printed gifts for birthdays, weddings, offices, and more.",
  },
];

const stats = [
  { number: "25K+", label: "Custom Orders Delivered" },
  { number: "500+", label: "Printing Products" },
  { number: "4.9★", label: "Customer Satisfaction" },
  { number: "24/7", label: "Customer Support" },
];

export default function AboutUs() {
  useEffect(() => {
  window.scrollTo(0, 0);
}, []);
  return (
  <>
    <TopHeader />

    <div className="w-full lg:w-[calc(100%-240px)] lg:ml-[240px] pt-[20px] bg-[#f8fafc] min-h-screen overflow-hidden">
      
      <Sidebar />

      <div className="flex-1 flex flex-col">

        {/* HERO SECTION */}
        <section className="relative bg-gradient-to-br from-[#f8fafc] via-[#eef4ff] to-[#fdf2f8] text-slate-900 px-6 py-20 md:py-28 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm mb-6 backdrop-blur-md">
            <ShoppingBag size={16} />
            Trusted Printing & Gift Store
          </div>

          <h1 className="text-4xl md:text-6xl  leading-tight">
            Turning Your
            <span className="text-blue-400"> Memories Into Prints</span>
          </h1>

          <p className="mt-6 text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto">
            From custom mugs and t-shirts to photo frames, business cards,
            posters, and personalized gifts — we create premium quality printing
            products that make every moment special.
          </p>
        </section>

        {/* STORY SECTION */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-full h-full bg-blue-100 rounded-3xl"></div>

              <img
                src="https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f"
                alt="team"
                className="relative rounded-3xl shadow-2xl object-cover h-[450px] w-full"
              />
            </div>

            <div>
              <p className="text-blue-600 font-semibold uppercase tracking-wider">
                Our Journey
              </p>

              <h2 className="text-4xl font-black text-slate-900 mt-4 leading-tight">
                Crafting Personalized Gifts & Premium Prints With Love
              </h2>

              <p className="text-slate-600 mt-6 leading-relaxed text-lg">
                What started as a small passion for creativity has now grown into
                a trusted destination for customized printing products and
                memorable gifts.
              </p>

              <p className="text-slate-600 mt-4 leading-relaxed text-lg">
                Whether it’s a birthday surprise, wedding gift, office branding,
                photo printing, or personalized merchandise — every product is
                made with attention to detail and quality materials.
              </p>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-blue-600 font-semibold uppercase tracking-wider">
                Why People Love Us
              </p>

              <h2 className="text-4xl font-black text-slate-900 mt-4">
                More Than Just Printing
              </h2>

              <p className="text-slate-600 mt-5 text-lg">
                We combine creativity, technology, and craftsmanship to create
                personalized products that leave a lasting impression.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16 pb-16">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group bg-slate-50 hover:bg-blue-600 transition-all duration-300 rounded-3xl p-8 shadow-sm hover:shadow-2xl"
                >
                  <div className="w-16 h-16 rounded-2xl bg-blue-100 group-hover:bg-white/20 flex items-center justify-center text-blue-600 group-hover:text-slate-900 transition-all">
                    {feature.icon}
                  </div>

                  <h3 className="text-2xl font-bold mt-6 text-slate-900 group-hover:text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="text-slate-600 group-hover:text-slate-200 mt-4 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <PremiumFooter />
      </div>
    </div>

    <BottomBar />
  </>
);
}
