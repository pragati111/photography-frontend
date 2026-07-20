import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_API_URL;

const CARD_ROUNDING = "rounded-3xl";

const gradients = [
  "bg-gradient-to-br from-[#f5efe6] to-[#e8dfcf]",
  "bg-gradient-to-br from-[#eef2f7] to-[#d9e2ec]",
  "bg-gradient-to-br from-[#f3e8ff] to-[#e9d5ff]",
  "bg-gradient-to-br from-[#e6f4f1] to-[#d1e7dd]",
  "bg-gradient-to-br from-[#fff4e6] to-[#fde2c4]",
];
// 🔥 Product Card (unchanged)
const ProductCard = ({ img, name, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white/90 backdrop-blur rounded-2xl p-2 flex flex-col h-full shadow-md hover:shadow-lg transition overflow-hidden cursor-pointer"
  >
    <div className="flex-1 flex items-center justify-center min-h-0">
      <img src={img} alt={name} className="h-14 md:h-20 object-contain" />
    </div>

    <div className="mt-1 flex items-center justify-center text-[10px] md:text-xs shrink-0 px-1">
      <span className="text-gray-700 font-medium text-center leading-tight line-clamp-2">
        {name}
      </span>
    </div>
  </div>
);

// 📦 Container (unchanged)
const CardContainer = ({
  children,
  className = "",
  variant = 0,
  noGrid = false,
}) => (
  <div
    className={`${gradients[variant]} ${CARD_ROUNDING} p-3 md:p-4 
    border border-gray-300/70 
    shadow-[0_10px_30px_rgba(0,0,0,0.12)] 
    hover:shadow-[0_14px_40px_rgba(0,0,0,0.18)]
    transition-all duration-300 
    overflow-hidden ${className}`}
  >
    {noGrid ? (
      children
    ) : (
      <div className="grid grid-cols-2 auto-rows-fr gap-3 h-full">
        {children}
      </div>
    )}
  </div>
);

// 🧠 Helper → get image safely
const getImage = (product) => {
  if (product.images?.length) return product.images[0];
  if (product.media?.length) return product.media[0].url;
  return "https://via.placeholder.com/150";
};

// 🧠 Helper → shuffle
const shuffleArray = (arr) => arr.sort(() => 0.5 - Math.random());

const CardCluster = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${API}/api/product`
        );
        const data = await res.json();

        // ✅ Filter "new" tagged products
        const newProducts = data.data.filter(
          (p) => p.tags && p.tags.includes("new")
        );

        // ✅ Shuffle & take 16
        const selected = shuffleArray(newProducts).slice(0, 16);

        setProducts(selected);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🎯 Helper to safely render product
  const renderCard = (index) => {
  const p = products[index];
  if (!p) return null;

  return (
    <ProductCard
      key={p._id}
      img={getImage(p)}
      name={p.productName || p.name}
      onClick={() => navigate(`/product/${p._id}`)}   // ✅ THIS LINE
    />
  );
};

  return (
    <div className="w-full bg-white p-4 md:p-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4">

        {/* SHIMMER LOADING STATE */}
        {loading && (
          <>
            {/* Column 1 */}
            <div className="md:col-span-3 flex flex-col gap-4">
              <CardContainer className="h-64 md:h-80" variant={0}>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white/90 backdrop-blur rounded-2xl p-2 flex flex-col h-full shadow-md overflow-hidden">
                    <div className="flex-1 flex items-center justify-center min-h-0">
                      <div className="h-14 md:h-20 w-full bg-gray-200 animate-pulse rounded"></div>
                    </div>
                    <div className="mt-1 flex items-center justify-center text-[10px] md:text-xs shrink-0 px-1">
                      <div className="h-3 w-16 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                  </div>
                ))}
              </CardContainer>

              <CardContainer className="h-32 md:h-40" variant={1}>
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="bg-white/90 backdrop-blur rounded-2xl p-2 flex flex-col h-full shadow-md overflow-hidden">
                    <div className="flex-1 flex items-center justify-center min-h-0">
                      <div className="h-14 md:h-20 w-full bg-gray-200 animate-pulse rounded"></div>
                    </div>
                    <div className="mt-1 flex items-center justify-center text-[10px] md:text-xs shrink-0 px-1">
                      <div className="h-3 w-16 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                  </div>
                ))}
              </CardContainer>
            </div>

            {/* Column 2 */}
            <div className="md:col-span-6 flex flex-col gap-4">
              <CardContainer
                className="h-64 md:h-80 flex items-center justify-center"
                variant={2}
                noGrid={true}
              >
                <div  className="bg-white/90 backdrop-blur-md rounded-full px-8 md:px-12 py-6 md:py-8 shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-gray-100 text-center max-w-lg w-full">
                  <div className="h-8 md:h-12 w-48 mx-auto bg-gray-200 animate-pulse rounded"></div>
                  <div className="mt-4 h-4 w-64 mx-auto bg-gray-200 animate-pulse rounded"></div>
                </div>
              </CardContainer>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CardContainer className="h-32 md:h-40" variant={3}>
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="bg-white/90 backdrop-blur rounded-2xl p-2 flex flex-col h-full shadow-md overflow-hidden">
                      <div className="flex-1 flex items-center justify-center min-h-0">
                        <div className="h-14 md:h-20 w-full bg-gray-200 animate-pulse rounded"></div>
                      </div>
                      <div className="mt-1 flex items-center justify-center text-[10px] md:text-xs shrink-0 px-1">
                        <div className="h-3 w-16 bg-gray-200 animate-pulse rounded"></div>
                      </div>
                    </div>
                  ))}
                </CardContainer>

                <CardContainer className="h-32 md:h-40" variant={4}>
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="bg-white/90 backdrop-blur rounded-2xl p-2 flex flex-col h-full shadow-md overflow-hidden">
                      <div className="flex-1 flex items-center justify-center min-h-0">
                        <div className="h-14 md:h-20 w-full bg-gray-200 animate-pulse rounded"></div>
                      </div>
                      <div className="mt-1 flex items-center justify-center text-[10px] md:text-xs shrink-0 px-1">
                        <div className="h-3 w-16 bg-gray-200 animate-pulse rounded"></div>
                      </div>
                    </div>
                  ))}
                </CardContainer>
              </div>
            </div>

            {/* Column 3 */}
            <div className="md:col-span-3 flex flex-col gap-4">
              <CardContainer className="h-32 md:h-40" variant={1}>
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="bg-white/90 backdrop-blur rounded-2xl p-2 flex flex-col h-full shadow-md overflow-hidden">
                    <div className="flex-1 flex items-center justify-center min-h-0">
                      <div className="h-14 md:h-20 w-full bg-gray-200 animate-pulse rounded"></div>
                    </div>
                    <div className="mt-1 flex items-center justify-center text-[10px] md:text-xs shrink-0 px-1">
                      <div className="h-3 w-16 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                  </div>
                ))}
              </CardContainer>

              <CardContainer className="h-64 md:h-80" variant={0}>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white/90 backdrop-blur rounded-2xl p-2 flex flex-col h-full shadow-md overflow-hidden">
                    <div className="flex-1 flex items-center justify-center min-h-0">
                      <div className="h-14 md:h-20 w-full bg-gray-200 animate-pulse rounded"></div>
                    </div>
                    <div className="mt-1 flex items-center justify-center text-[10px] md:text-xs shrink-0 px-1">
                      <div className="h-3 w-16 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                  </div>
                ))}
              </CardContainer>
            </div>
          </>
        )}

        {/* ACTUAL CONTENT */}
        {!loading && (
          <>
            {/* Column 1 */}
            <div className="md:col-span-3 flex flex-col gap-4">
              <CardContainer className="h-64 md:h-80" variant={0}>
                {renderCard(0)}
                {renderCard(1)}
                {renderCard(2)}
                {renderCard(3)}
              </CardContainer>

              <CardContainer className="h-32 md:h-40" variant={1}>
                {renderCard(4)}
                {renderCard(5)}
              </CardContainer>
            </div>

            {/* Column 2 */}
            <div className="md:col-span-6 flex flex-col gap-4">
              <CardContainer
  className="h-64 md:h-80 flex items-center justify-center cursor-pointer"
  variant={2}
  noGrid={true}
>
  <div
    onClick={() => navigate("/newly-launched")}
    className="bg-white/90 backdrop-blur-md rounded-full px-8 md:px-12 py-6 md:py-8 shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-gray-100 text-center max-w-lg w-full cursor-pointer"
  >
    <h2
      className="text-2xl md:text-4xl font-semibold leading-tight tracking-wide 
      bg-gradient-to-r from-[#d4af37] via-[#f5d27a] to-[#c89b3c] 
      bg-clip-text text-transparent 
      drop-shadow-[0_2px_6px_rgba(212,175,55,0.4)]"
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      Newly Launched
    </h2>

    <p className="mt-4 text-gray-600 text-xs md:text-sm tracking-wide">
      Premium Prints • Timeless Designs • Personalized Touch
    </p>
  </div>
</CardContainer>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CardContainer className="h-32 md:h-40" variant={3}>
                  {renderCard(6)}
                  {renderCard(7)}
                </CardContainer>

                <CardContainer className="h-32 md:h-40" variant={4}>
                  {renderCard(8)}
                  {renderCard(9)}
                </CardContainer>
              </div>
            </div>

            {/* Column 3 */}
            <div className="md:col-span-3 flex flex-col gap-4">
              <CardContainer className="h-32 md:h-40" variant={1}>
                {renderCard(10)}
                {renderCard(11)}
              </CardContainer>

              <CardContainer className="h-64 md:h-80" variant={0}>
                {renderCard(12)}
                {renderCard(13)}
                {renderCard(14)}
                {renderCard(15)}
              </CardContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CardCluster;