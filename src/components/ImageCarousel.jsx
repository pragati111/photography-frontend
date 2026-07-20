import { useState, useEffect } from "react";

const images = [
  "/images/1.jpg",
  "/images/2.jpg",
  "/images/3.jpg",
  "/images/4.jpg",
  "/images/5.jpg",
  "/images/6.jpg",
  "/images/7.jpg",
];

function ImageCarousel() {
  const [index, setIndex] = useState(0);

  // Auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-[300px] max-w-[420px] mx-auto">
      
      {/* Image */}
      <div className="relative overflow-hidden rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.2)]">
        <img
          src={images[index]}
          alt=""
          className="w-full h-[160px] sm:h-[190px] md:h-[220px] object-cover transition-all duration-700"
        />
      </div>

      {/* Dots */}
      <div className="flex justify-center mt-4 gap-2">
        {images.map((_, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full cursor-pointer transition-all ${
              i === index
                ? "w-6 bg-red-500"
                : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default ImageCarousel;