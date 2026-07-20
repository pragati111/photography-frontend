import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { Star } from "lucide-react";
import axios from "axios";
import { Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const API = import.meta.env.VITE_API_URL;


const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
  const fetchTestimonials = async () => {
    try {
      const res = await axios.get(`${API}/api/testimonials/get`);
      setTestimonials(res.data.data.reverse()); // ✅ correct
    } catch (err) {
      console.error("Error fetching testimonials:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchTestimonials();
}, []);

  if (loading) {
    return <div className="text-center py-10">Loading testimonials...</div>;
  }

  if (!testimonials.length) {
    return <div className="text-center py-10">No testimonials yet</div>;
  }

  return (
    <section className="relative w-full py-12 bg-gradient-to-tr from-slate-50 via-white to-blue-50">
      <div className="max-w-[1200px] mx-auto px-6">

        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Testimonials</h2>
          <p className="text-gray-500 text-xs max-w-md mx-auto">
            Real feedback from our valued clients across the globe.
          </p>
        </div>

        <Swiper
        autoplay={{
  delay: 0, // continuous flow
  disableOnInteraction: false,
}}
speed={4000} // controls smoothness (higher = slower, smoother)
loop={true}
          modules={[Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
          className="pb-12"
        >
          {testimonials.map((item) => (
            <SwiperSlide key={item._id} className="h-auto">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col h-[260px] transition-transform hover:-translate-y-1">
                
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                  
                  {/* Avatar with fallback */}
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-full object-cover brightness-95 border border-gray-100"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold uppercase">
                      {item.name?.charAt(0)}
                    </div>
                  )}

                  <div className="overflow-hidden">
                    <h4 className="font-bold text-gray-800 text-sm truncate">
                      {item.name}
                    </h4>
                    <p className="text-gray-400 text-[11px] leading-none">
                      {/* optional: role if you add later */}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-grow overflow-y-auto mb-4 custom-card-scroll pr-1">
                  <p className="text-gray-600 text-[12px] leading-relaxed">
                    {item.review}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={
                          i < item.rating ? "text-yellow-400" : "text-gray-200"
                        }
                        fill={i < item.rating ? "currentColor" : "none"}
                      />
                    ))}
                  </div>

                  <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-tighter">
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style>{`
        .swiper-pagination-bullet {
          width: 6px;
          height: 6px;
          background: #cbd5e1 !important;
          opacity: 1 !important;
        }
        .swiper-pagination-bullet-active {
          background: #94a3b8 !important;
          transform: scale(1.2);
        }

        .custom-card-scroll::-webkit-scrollbar {
          width: 3px;
        }
        .custom-card-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-card-scroll::-webkit-scrollbar-thumb {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-card-scroll:hover::-webkit-scrollbar-thumb {
          background: #e2e8f0;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;