import { useState, useEffect } from "react";
import WorkspaceBranding from "./WorkspaceBranding";
import TradeShows from "./TradeShows";
import MarketingSection from "./MarketingSection";
import CategoryBanner from "./CategoryBanner";
import EcoBackdropBanner from "./EcoBackdropBanner";
import OrderProcess from "./OrderProcess";
import Testimonials from "./Testimonials";
import PremiumFooter from "./PremiumFooter";
import CardCluster from "./CardCluster";
import PremiumShowcase from "./PremiumShowcase";
import InfographicTimeline from "./InfographicTimeline";
import HeroSection from "./HeroSection";
import {
  Star,
  ShieldCheck,
  Headphones,
  Truck,
  Clock,
  Award,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import CouponsSection from "./CouponsSection";
const API = import.meta.env.VITE_API_URL;

const features = [
  {
    title: "1217+ Reviews",
    subtitle: "4.7 ★★★★★",
    icon: <Star size={18} />,
    color: "bg-yellow-500",
  },
  {
    title: "25+ Years Expertise",
    subtitle: "Print Perfected",
    icon: <Award size={18} />,
    color: "bg-purple-500",
  },
  {
    title: "Expert Support",
    subtitle: "Chat, Email, Call",
    icon: <Headphones size={18} />,
    color: "bg-blue-500",
  },
  {
    title: "Secure Payment",
    subtitle: "100% Safe",
    icon: <ShieldCheck size={18} />,
    color: "bg-green-500",
  },
  {
    title: "Quick Turnaround",
    subtitle: "Rapid Production",
    icon: <Clock size={18} />,
    color: "bg-orange-500",
  },
  {
    title: "Venue Delivery",
    subtitle: "Flexible Drop-off",
    icon: <Truck size={18} />,
    color: "bg-pink-500",
  },
];

export default function HomeContent() {
  return (
    <div className="space-y-6">
      <HeroSection />
      <CouponsSection/>

      {/* 🔶 Features */}
      <div className="px-4 md:px-8 lg:px-12 pb-6">
        <div className="bg-gray-100 p-4 md:p-5 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 rounded-xl">
          {features.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-gray-200 
                       rounded-xl p-3 md:p-4 shadow-sm hover:shadow-md 
                       transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-white shrink-0 ${item.color}`}
              >
                {item.icon}
              </div>

              {/* Text */}
              <div>
                <h3 className="text-[9px] md:text-sm font-semibold text-gray-900 leading-tight">
                  {item.title}
                </h3>
                <p className="text-[7px] md:text-xs text-gray-500">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔶 Premium Banner Suite */}
      <HomeBannerCarousel />

      {/* 🔶 Workspace Branding */}
      <WorkspaceBranding />

      {/* 🔶 Trade Shows */}
      <TradeShows />

      {/* 🔶 Card Cluster */}
      <CardCluster />

      {/* 🔶 Premium Showcase */}
      <PremiumShowcase />

      {/* 🔶 Infographic Timeline */}
      <InfographicTimeline />

      {/* 🔶 Testimonials */}
      <Testimonials />

      {/* 🔶 Premium Footer */}
      <PremiumFooter />
    </div>
  );
}

function HomeBannerCarousel() {
  const [banners, setBanners] = useState([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const [thumbPage, setThumbPage] = useState(0);

  const thumbnailsPerPage = 6;

  const totalPages = Math.ceil(banners.length / thumbnailsPerPage);

  const visibleThumbnails = banners.slice(
    thumbPage * thumbnailsPerPage,
    (thumbPage + 1) * thumbnailsPerPage,
  );

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(
          `${API}/api/ads/get`,
        );
        const data = await res.json();
        const bannerObject = data?.banner || {};

        const sortedBanners = Object.entries(bannerObject)
          .filter(
            ([key, value]) =>
              key.toLowerCase().startsWith("homebanner") && value,
          )
          .sort((a, b) => {
            const aIndex = Number(a[0].replace(/[^0-9]/g, "")) || 0;
            const bIndex = Number(b[0].replace(/[^0-9]/g, "")) || 0;
            return aIndex - bIndex;
          })
          .map(([, value]) => value);

        setBanners(sortedBanners);
      } catch (err) {
        console.error("Failed to load home banners:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
  setThumbPage(Math.floor(active / thumbnailsPerPage));
}, [active]);

  useEffect(() => {
    if (!banners.length) return;

    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners]);

  if (loading) {
    return (
      <div className="px-4 md:px-8 lg:px-12 py-8">
        <div className="rounded-[32px] border border-white/20 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/30">
          <div className="h-[420px] rounded-[28px] bg-slate-900/70 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!banners.length) return null;

  return (
    <section className="px-4 md:px-8 lg:px-12 py-8">
      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-[#0f172a] shadow-2xl shadow-slate-950/40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(96,165,250,0.18),_transparent_30%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(236,72,153,0.16),_transparent_28%)] pointer-events-none" />

        <div className="relative grid gap-6 lg:grid-cols-[1.6fr_0.9fr] items-center px-5 py-4 md:p-6">
          <div className="relative overflow-hidden rounded-[28px] mr-7 md:mr-0">
            <img
              src={banners[active]}
              alt={`Banner ${active + 1}`}
              className="w-full h-[420px] object-cover transition duration-700 ease-out"
            />
            <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-slate-950/95 to-transparent" />
            <div className="absolute inset-x-0 bottom-6 px-6 md:px-10">
              <div className="max-w-2xl text-white">
                {/*<p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">
                  Latest Updates
                </p>*/}
                <p className="mt-3  font-semibold tracking-tight text-white">
                  Stay Updated With Our New Products & Announcements
                </p>
                <p className="mt-3 max-w-2xl text-sm md:text-base text-slate-200/80">
                  Explore newly launched products, special offers, seasonal collections,
                  printing innovations, and important business updates from our latest announcements.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 px-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-400">
                  Update Board
                </p>
                <p className="text-2xl font-semibold text-white">
                  Latest Announcements
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-slate-950/80 p-2 shadow-lg shadow-slate-950/30">
                <button
                  onClick={() =>
                    setActive(
                      (prev) => (prev - 1 + banners.length) % banners.length,
                    )
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-white/10 text-white hover:bg-white/15"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() =>
                    setActive((prev) => (prev + 1) % banners.length)
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-white/10 text-white hover:bg-white/15"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {/* Thumbnail Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() =>
                    setThumbPage((prev) =>
                      prev === 0 ? totalPages - 1 : prev - 1,
                    )
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-white/10 text-white hover:bg-white/15"
                >
                  <ChevronLeft size={16} />
                </button>

                <span className="text-xs tracking-[0.2em] uppercase text-slate-400">
                  Updates {thumbPage * 6 + 1}-
                  {Math.min((thumbPage + 1) * 6, banners.length)}
                </span>

                <button
                  onClick={() =>
                    setThumbPage((prev) =>
                      prev === totalPages - 1 ? 0 : prev + 1,
                    )
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-white/10 text-white hover:bg-white/15"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {visibleThumbnails.map((src, idx) => {
                  const actualIndex = thumbPage * thumbnailsPerPage + idx;

                  return (
                    <button
                      key={actualIndex}
                      onClick={() => setActive(actualIndex)}
                      className={`overflow-hidden rounded-3xl border transition duration-300 ${
                        actualIndex === active
                          ? "border-sky-400 shadow-[0_0_0_1px_rgba(56,189,248,0.55)]"
                          : "border-slate-700/60 hover:border-slate-500"
                      }`}
                    >
                      <img
                        src={src}
                        alt={`Thumbnail ${actualIndex + 1}`}
                        className="h-24 w-full object-cover transition duration-300 hover:scale-105"
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-4 shadow-lg shadow-slate-950/30">
              <div className="flex items-center gap-3 text-white">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-300">
                  <Sparkles size={20} />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-400">
                    What's New
                  </p>
                  <p className="text-base font-semibold">
                    Discover our latest products, offers, and printing updates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* 🔹 Feature */
function Feature({ title, subtitle }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-100"></div>
      <div>
        <h4 className="font-semibold text-xs md:text-sm">{title}</h4>
        <p className="text-[10px] md:text-xs text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}
