import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import "swiper/css";

import WeddingFilmCard from "./WeddingFilmCard";

// Replace these with your own images
import film1 from "../../assets/blogs/1.png"
import film2 from "../../assets/blogs/2.png";
import film3 from "../../assets/blogs/3.png";
import film4 from "../../assets/blogs/4.png";

const films = [
  {
    id: 1,
    image: film1,
    title: "Indu & Sahil",
    subtitle: "A KnotsbyAMP Film",
  },
  {
    id: 2,
    image: film2,
    title: "Avi & Vai",
    subtitle: "A KnotsbyAMP Film",
  },
  {
    id: 3,
    image: film3,
    title: "Rhea & Karan",
    subtitle: "A KnotsbyAMP Film",
  },
  {
    id: 4,
    image: film4,
    title: "Megha & Yash",
    subtitle: "A KnotsbyAMP Film",
  },
];

export default function WeddingFilmsSection() {
  const swiperRef = useRef(null);

  return (
    <section
  className="relative bg-[#B8A18D] pt-36 pb-28 overflow-hidden"
  style={{
  clipPath:
    "polygon(0 7%, 38% 7%, 50% 0%, 62% 7%, 100% 7%, 100% 100%, 0 100%)",
}}
>
      {/* Curved Top */}
      <div className="absolute top-0 left-0 w-full -translate-y-[98%]">
        <svg
          viewBox="0 0 1440 220"
          preserveAspectRatio="none"
          className="w-full h-[220px]"
        >
          <path
            d="
              M0,220
              C240,80 520,40 760,150
              C1000,260 1180,110 1440,80
              L1440,220
              L0,220
              Z
            "
            fill="#B7A18F"
          />
        </svg>
      </div>

      {/* Heading */}
      <div className="relative z-10 text-center">
        <h2 className="font-serif text-white text-5xl md:text-7xl leading-tight">
          Beautiful
          <br />
          Weddings,
        </h2>

        <div className="relative inline-block mt-2">
          <h3 className="italic text-white font-serif text-5xl md:text-7xl">
            Breathtaking Films
          </h3>

          <svg
            className="absolute -bottom-4 left-0 w-full"
            viewBox="0 0 500 35"
          >
            <path
              d="M5 18 C80 12 150 25 250 18 C340 8 420 24 495 15"
              stroke="white"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative mt-20">
        {/* Previous Button */}
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute left-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white shadow-xl flex items-center justify-center hover:scale-110 transition"
        >
          <ArrowLeft size={26} />
        </button>

        {/* Next Button */}
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="absolute right-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white shadow-xl flex items-center justify-center hover:scale-110 transition"
        >
          <ArrowRight size={26} />
        </button>

        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          loop={true}
          centeredSlides={true}
          grabCursor={true}
          speed={800}
          spaceBetween={28}
          breakpoints={{
    0:{
        slidesPerView:1.15,
        spaceBetween:16,
    },

    768:{
        slidesPerView:1.7,
        spaceBetween:20,
    },

    1024:{
        slidesPerView:2.3,
        spaceBetween:24,
    },

    1280:{
        slidesPerView:3.2,
        spaceBetween:28,
    }
}}
          className="px-8 lg:px-28"
        >
          {films.map((film) => (
            <SwiperSlide key={film.id}>
              <WeddingFilmCard film={film} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}