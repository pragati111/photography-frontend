import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/navigation";

const cards = [
  {
    title: "Wedding Stories",
    subtitle: "Capturing timeless love stories.",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900",
  },
  {
    title: "Destination Wedding",
    subtitle: "Dream weddings around the world.",
    image:
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=900",
  },
  {
    title: "Couple Shoot",
    subtitle: "Moments you'll cherish forever.",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=900",
  },
  {
    title: "Wedding Films",
    subtitle: "Stories that move hearts.",
    image:
      "https://images.unsplash.com/photo-1529636798458-92182e662485?w=900",
  },
  {
    title: "Pre Wedding",
    subtitle: "Every beginning deserves magic.",
    image:
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=900",
  },
];

export default function PremiumCarousel() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section className="relative py-20 bg-[#faf8f5] overflow-hidden">

      <div className="max-w-7xl mx-auto px-6">

        <div className="flex items-center justify-between mb-12">

          <div>
            <Link
              to="/films"
              className="inline-flex items-center justify-center rounded-xl border border-amber-600 bg-white/10 px-5 py-2 text-sm uppercase tracking-[4px] text-amber-600 transition hover:bg-white/20"
            >
              View All Films
            </Link>

            <h2 className="mt-4 text-5xl font-serif">
              Featured Collections
            </h2>
          </div>

          <div className="flex gap-4">

            <button
              ref={prevRef}
              className="w-14 h-14 rounded-full bg-white shadow-xl hover:bg-black hover:text-white transition"
            >
              <ChevronLeft className="mx-auto" />
            </button>

            <button
              ref={nextRef}
              className="w-14 h-14 rounded-full bg-white shadow-xl hover:bg-black hover:text-white transition"
            >
              <ChevronRight className="mx-auto" />
            </button>

          </div>

        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={120}
          slidesPerView={1.2}
          loop={true}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          breakpoints={{
            640: {
              slidesPerView: 1.05,
            },
            768: {
              slidesPerView: 1.15,
            },
            1024: {
              slidesPerView: 1.4,
            },
            1400: {
              slidesPerView: 1.7,
            },
          }}
        >
          {cards.map((card, index) => (
            <SwiperSlide key={index}>
              <PremiumCard card={card} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

function PremiumCard({ card }) {
  return (
    <div className="group relative aspect-[16/9] min-h-[380px] rounded-[34px] overflow-hidden cursor-pointer lg:min-h-[420px] transition duration-500 hover:-translate-y-1">

      <img
        src={card.image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition duration-700"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      <div className="absolute top-6 right-6">

        <div className="backdrop-blur-md bg-white/20 px-4 py-2 rounded-full text-white text-xs tracking-[3px] uppercase">
          Featured
        </div>

      </div>

      <div className="absolute bottom-0 left-0 w-full p-8">

        <p className="text-amber-400 tracking-[4px] uppercase text-xs mb-3">
          Collection
        </p>

        <h3 className="text-3xl text-white font-serif mb-4">
          {card.title}
        </h3>

        <p className="text-gray-200 leading-relaxed">
          {card.subtitle}
        </p>


      </div>

      <div className="absolute inset-0 border border-white/10 rounded-[34px]" />

      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition duration-500 bg-white/5 backdrop-blur-[2px]" />

    </div>
  );
}