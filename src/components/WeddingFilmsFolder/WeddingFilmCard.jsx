import React from "react";
import { Play } from "lucide-react";

const WeddingFilmCard = ({ film }) => {
  return (
    <div className="group relative overflow-hidden rounded-[28px] h-[620px] w-full cursor-pointer shadow-[0_20px_60px_rgba(0,0,0,0.18)]">

      {/* Image */}
      <img
        src={film.image}
        alt={film.title}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Dark Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

      {/* Play Button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="
            flex
            h-20
            w-20
            items-center
            justify-center
            rounded-full
            border
            border-white/60
            bg-white/20
            backdrop-blur-md
            transition-all
            duration-300
            group-hover:scale-110
            group-hover:bg-white/30
          "
        >
          <Play
            className="ml-1 text-white"
            size={34}
            fill="white"
          />
        </div>
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 w-full p-8">

        <h3
          className="
            font-serif
            text-4xl
            text-white
            drop-shadow-lg
          "
        >
          {film.title}
        </h3>

        <p
          className="
            mt-2
            text-sm
            tracking-[0.25em]
            uppercase
            text-white/80
          "
        >
          {film.subtitle}
        </p>

      </div>

      {/* Hover Glow */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          rounded-[28px]
          ring-0
          ring-white/40
          transition-all
          duration-300
          group-hover:ring-2
        "
      />

    </div>
  );
};

export default WeddingFilmCard;