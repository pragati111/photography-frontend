import React from "react";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_API_URL;

const CategoryStack = ({ title, subtitle, items }) => {
  const navigate = useNavigate();
  return (
    /* The outer container maintains a consistent height for the whole 'Stack' */
    <div className="flex flex-col w-full h-[370px] md:h-[580px] bg-gray-100 border border-white/10 rounded-2xl p-4 md:p-6 shadow-2xl transition-all hover:border-amber-500/30 group">
      {/* Header Section: Fixed Height */}
      <div className="mb-4 md:mb-6 border-b border-gray-200/50 pb-4 flex-shrink-0">
        <h2 className="text-xl md:text-2xl font-serif tracking-wide text-black uppercase italic">
          {title}
        </h2>
        <p className="text-[10px] uppercase tracking-[0.2em] text-amber-600 font-semibold mt-1">
          {subtitle}
        </p>
      </div>

      {/* Scrollable Grid Container */}
      {/* 1. flex-grow: Fills the remaining space in the 600px parent.
          2. overflow-y-auto: Enables the scroll.
          3. scrollbar-thin: Premium thin scrollbar style.
      */}
      <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 pb-4">
          {items.map((item, idx) => (
            <div
              key={idx}
              onClick={() => navigate(`/product/${item._id}`)}
              className="group/card relative bg-gray-200 p-[1px] rounded-xl overflow-hidden cursor-pointer h-fit"
            >
              <div className="bg-white p-2 md:p-3 rounded-xl flex flex-row md:flex-col items-center md:items-start transition-colors group-hover/card:bg-gray-50">
                <div  className="relative w-20 h-14 md:w-full md:h-auto md:aspect-square flex-shrink-0 md:mb-3 overflow-hidden rounded-lg bg-gray-50">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110 opacity-95"
                  />
                </div>

                <div className="ml-3 md:ml-0 flex-grow">
                  <div className="flex gap-0.5 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={8}
                        fill={i < Math.floor(item.rating) ? "#d4af37" : "none"}
                        className={
                          i < Math.floor(item.rating)
                            ? "text-amber-500"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <h3 className="text-xs font-semibold text-gray-900 truncate">
                    {item.name}
                  </h3>
                  <p className="text-[9px] text-gray-500 mt-0.5 italic line-clamp-1 mr-5">
                    {item.tagline}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global CSS for the Premium Scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db; /* Light gray thumb */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #b45309; /* Amber/Gold on hover */
        }
      `}</style>
    </div>
  );
};

const PremiumShowcase = () => {
  const [collections, setCollections] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(`${API}/api/product`)
      .then((res) => res.json())
      .then((res) => {
        const products = res.data || [];

        const premium = products
          .filter((p) => p.tags?.includes("premium"))
          .map((p) => ({
            _id: p._id,
            name: p.productName || p.name,
            tagline: p.description,
            image: p.images?.[0] || p.media?.[0]?.url,
            rating: p.rating,
          }));

        const bestSeller = products
          .filter((p) => p.tags?.includes("best seller"))
          .map((p) => ({
            _id: p._id,
            name: p.productName || p.name,
            tagline: p.description,
            image: p.images?.[0] || p.media?.[0]?.url,
            rating: p.rating,
          }));

        const mostPopular = products
          .filter((p) => p.tags?.includes("most popular"))
          .map((p) => ({
            _id: p._id,
            name: p.productName || p.name,
            tagline: p.description,
            image: p.images?.[0] || p.media?.[0]?.url,
            rating: p.rating,
          }));

        setCollections([
          {
            title: "Premium",
            subtitle: "Luxury Selections",
            items: premium,
          },
          {
            title: "Best Seller",
            subtitle: "Artisan Discoveries",
            items: bestSeller,
          },
          {
            title: "Most Popular",
            subtitle: "Interior Touches",
            items: mostPopular,
          },
        ]);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white min-h-screen py-10 px-4 md:px-8 flex items-center justify-center">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
        {/* SHIMMER LOADING STATE */}
        {loading && (
          <>
            {[...Array(3)].map((_, colIdx) => (
              <div
                key={colIdx}
                className="flex flex-col w-full h-[370px] md:h-[580px] bg-gray-100 border border-white/10 rounded-2xl p-4 md:p-6 shadow-2xl"
              >
                {/* Header Section */}
                <div className="mb-4 md:mb-6 border-b border-gray-200/50 pb-4 flex-shrink-0">
                  <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-3 w-24 bg-gray-200 animate-pulse rounded mt-2"></div>
                </div>

                {/* Scrollable Grid Container */}
                <div className="flex-grow overflow-y-auto pr-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 pb-4">
                    {[...Array(4)].map((_, itemIdx) => (
                      <div
                        key={itemIdx}
                        className="relative bg-gray-200 p-[1px] rounded-xl overflow-hidden h-fit"
                      >
                        <div className="bg-white p-2 md:p-3 rounded-xl flex flex-row md:flex-col items-center md:items-start">
                          <div className="w-20 h-14 md:w-full md:h-auto md:aspect-square flex-shrink-0 md:mb-3 overflow-hidden rounded-lg bg-gray-200 animate-pulse"></div>

                          <div className="ml-3 md:ml-0 flex-grow">
                            <div className="flex gap-0.5 mb-1">
                              {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-2 h-2 bg-gray-200 rounded-full animate-pulse"></div>
                              ))}
                            </div>
                            <div className="h-3 w-20 bg-gray-200 animate-pulse rounded mb-1"></div>
                            <div className="h-2 w-16 bg-gray-200 animate-pulse rounded"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ACTUAL CONTENT */}
        {!loading && collections.map((col, index) => (
          <CategoryStack key={index} {...col} />
        ))}
      </div>
    </div>
  );
};

export default PremiumShowcase;
