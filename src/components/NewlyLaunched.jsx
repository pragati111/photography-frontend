// NewlyLaunched.jsx

import React, { useEffect, useState } from "react";
import TopHeader from "./TopHeader";
import BottomBar from "./BottomBar";
import PremiumFooter from "./PremiumFooter";
import Sidebar from "./SideBar";
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_API_URL;

export default function NewlyLaunched() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const [priceSort, setPriceSort] = useState("");
const [ratingSort, setRatingSort] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${API}/api/product`,
        );

        const data = await res.json();

        if (!data.success) return;

        // ✅ only products having "new" tag
        const newProducts = data.data.filter(
          (product) =>
            product.tags &&
            product.tags.some((tag) => tag.toLowerCase() === "new"),
        );

        setProducts(newProducts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  const getImage = (product) => {
    const mediaImage = product.media?.find((m) => m.type === "image" && m.url);

    if (mediaImage) return mediaImage.url;

    if (product.images?.length) return product.images[0];

    if (product.image) return product.image;

    return "https://via.placeholder.com/400";
  };

  const sortedProducts = [...products]
  .sort((a, b) => {
    // PRICE SORT
    if (priceSort === "lowHigh") {
      return (a.discountedMRP || a.price) - (b.discountedMRP || b.price);
    }

    if (priceSort === "highLow") {
      return (b.discountedMRP || b.price) - (a.discountedMRP || a.price);
    }

    return 0;
  })
  .sort((a, b) => {
    // RATING SORT
    if (ratingSort === "highLow") {
      return (b.rating || 0) - (a.rating || 0);
    }

    return 0;
  });
  return (
    <div className="font-sans">
      <TopHeader />

      <div className="flex">
        <Sidebar />

        <div className="w-full lg:w-[calc(100%-240px)] lg:ml-[240px] pt-[90px] md:pt-[110px]">
          <div className="px-4 md:px-8 lg:px-12 pb-10">
            {/* TITLE + FILTERS */}
<div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

  {/* LEFT */}
<h1 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
  Newly Launched List{" "}
  <span className="text-gray-400 font-normal text-sm sm:text-base md:text-lg">
    ({products.length})
  </span>
</h1>

  {/* RIGHT FILTERS */}
  <div className="flex gap-2 overflow-x-auto no-scrollbar sm:justify-end">

    {/* PRICE */}
    <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md shrink-0">
      <span className="text-[10px] sm:text-xs text-gray-600">
        Price:
      </span>

      <select
        value={priceSort}
        onChange={(e) => setPriceSort(e.target.value)}
        className="text-[10px] sm:text-xs bg-transparent focus:outline-none"
      >
        <option value="">None</option>
        <option value="lowHigh">Low → High</option>
        <option value="highLow">High → Low</option>
      </select>
    </div>

    {/* RATING */}
    <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md shrink-0">
      <span className="text-[10px] sm:text-xs text-gray-600">
        Rating:
      </span>

      <select
        value={ratingSort}
        onChange={(e) => setRatingSort(e.target.value)}
        className="text-[10px] sm:text-xs bg-transparent focus:outline-none"
      >
        <option value="">None</option>
        <option value="highLow">High → Low</option>
      </select>
    </div>
  </div>
</div>

            {/* SHIMMER */}
            {loading && (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100"
                  >
                    <div className="w-full aspect-[4/3] bg-gray-200 animate-pulse"></div>

                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>

                      <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PRODUCTS */}
            {!loading && (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                {sortedProducts.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="bg-white rounded-xl overflow-hidden shadow-md shadow-black/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100"
                  >
                    {/* IMAGE */}
                    <div className="w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                      <img
                        src={getImage(product)}
                        alt={product.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="p-2.5 sm:p-3 md:p-4 flex flex-col gap-1.5">
                      <h2 className="text-[12px] sm:text-sm md:text-base font-semibold text-gray-800">
                        {product.productName}
                      </h2>

                      <div className="flex items-center gap-1 text-[9px] sm:text-[10px]">
                        <div className="bg-gray-100 px-1.5 py-[2px] rounded-full">
                          ⭐ {product.rating}
                        </div>

                        <div className="bg-gray-100 px-1.5 py-[2px] rounded-full capitalize">
                          {product.tags[1]}
                        </div>
                      </div>

                      <p
                        className="hidden sm:block text-xs text-gray-500 overflow-hidden"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {product.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <PremiumFooter />
          <BottomBar />
        </div>
      </div>
    </div>
  );
}
