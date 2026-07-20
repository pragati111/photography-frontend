import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TopHeader from "./TopHeader";
import BottomBar from "./BottomBar";
import PremiumFooter from "./PremiumFooter";
import Sidebar from "./SideBar";
import EcoBackdropBanner from "./EcoBackdropBanner";
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_API_URL;

export default function SubcategoryDisplay() {
  const { subCategoryName } = useParams();
  const decodedName = decodeURIComponent(subCategoryName);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("");
  const [priceSort, setPriceSort] = useState("");
  const [ratingSort, setRatingSort] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API}/api/product`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) return;

        const filtered = data.data.filter(
          (p) =>
            p?.subCategory?.name?.trim().toLowerCase() ===
            decodedName?.trim().toLowerCase(),
        );

        setProducts(filtered);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [decodedName]);

  useEffect(() => {
  if (loading) {
    window.scrollTo({ top: 0, behavior: "instant" });
  }
}, [loading]);

  const getImage = (product) => {
    const mediaImg = product.media?.find((m) => m.type === "image" && m.url);

    if (mediaImg) return mediaImg.url;
    if (product.images && product.images.length > 0) return product.images[0];

    return "/placeholder.jpg";
  };

  const sortedProducts = [...products]
    .sort((a, b) => {
      // Price sorting
      if (priceSort === "lowHigh") return a.price - b.price;
      if (priceSort === "highLow") return b.price - a.price;
      return 0;
    })
    .sort((a, b) => {
      // Rating sorting (applied after price)
      if (ratingSort === "highLow") return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  return (
    <div className="font-sans">
      {/* 🔥 TOP HEADER */}
      <TopHeader />

      <div className="flex">
        {/* 🔥 SIDEBAR */}
        <Sidebar />

        {/* 🔥 MAIN CONTENT */}
        <div className="w-full lg:w-[calc(100%-240px)] lg:ml-[240px] pt-[90px] md:pt-[110px]">
          <div className="px-4 md:px-8 lg:px-12 pb-10">
            {/* TITLE + FILTERS */}
            <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              {/* LEFT: TITLE */}
              <h1 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
                Products List{" "}
                <span className="text-gray-400 font-normal text-sm sm:text-base md:text-lg">
                  ({products.length})
                </span>
              </h1>

              {/* RIGHT: FILTERS */}
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

            {/* SHIMMER LOADING STATE */}
            {loading && (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl overflow-hidden shadow-md shadow-black/10 border border-gray-100"
                  >
                    {/* IMAGE SKELETON */}
                    <div className="w-full aspect-[4/3] sm:aspect-[4/3] bg-gray-100 overflow-hidden">
                      <div className="w-full h-full bg-gray-200 animate-pulse"></div>
                    </div>

                    {/* CONTENT SKELETON */}
                    <div className="p-2.5 sm:p-3 md:p-4 flex flex-col gap-1.5">
                      {/* TITLE */}
                      <div className="h-3 sm:h-4 md:h-5 w-3/4 bg-gray-200 animate-pulse rounded"></div>

                      {/* RATING + TAG */}
                      <div className="flex items-center gap-1">
                        <div className="h-4 w-8 bg-gray-200 animate-pulse rounded-full"></div>
                        <div className="h-4 w-12 bg-gray-200 animate-pulse rounded-full"></div>
                      </div>

                      {/* DESCRIPTION */}
                      <div className="hidden sm:block">
                        <div className="h-2 w-full bg-gray-200 animate-pulse rounded mb-1"></div>
                        <div className="h-2 w-2/3 bg-gray-200 animate-pulse rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* EMPTY STATE */}
            {!loading && products.length === 0 && (
              <p className="text-gray-500">No products found.</p>
            )}

            {/* 🔥 PREMIUM PRODUCT GRID */}
            {!loading && (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                {sortedProducts.map((product) => (
                <div
                  key={product._id}
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="bg-white rounded-xl overflow-hidden shadow-md shadow-black/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100"
                >
                  {/* IMAGE */}
                  <div className="w-full aspect-[4/3] sm:aspect-[4/3] bg-gray-100 overflow-hidden">
                    <img
                      src={getImage(product)}
                      alt={product.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="p-2.5 sm:p-3 md:p-4 flex flex-col gap-1.5">
                    {/* TITLE */}
                    <h2 className="text-[12px] sm:text-sm md:text-base font-semibold text-gray-800 leading-tight ">
                      {product.productName}
                    </h2>

                    {/* RATING + TAG */}
                    <div className="flex items-center gap-1 text-[9px] sm:text-[10px] overflow-x-auto whitespace-nowrap no-scrollbar">
                      <div className="bg-gray-100 px-1.5 py-[2px] rounded-full shrink-0">
                        ⭐ {product.rating || 4.5}
                      </div>

                      {product.tags && product.tags.length > 0 ? (
                        product.tags.slice(0, 1).map((tag, i) => (
                          <div
                            key={i}
                            className="bg-gray-100 px-1.5 py-[2px] rounded-full capitalize shrink-0"
                          >
                            {tag}
                          </div>
                        ))
                      ) : (
                        <div className="bg-gray-100 px-1.5 py-[2px] rounded-full shrink-0">
                          General
                        </div>
                      )}
                    </div>

                    {/* DESCRIPTION (only on >= sm) */}
                    <p className="hidden sm:block text-xs text-gray-500 line-clamp-2">
                      {product.description?.slice(0, 70)}...
                    </p>
                  </div>
                </div>
              ))}
              </div>
            )}
          </div>

          {/* 🔥 FOOTERS (ALIGNED CORRECTLY) */}
          <PremiumFooter />
          <BottomBar />
        </div>
      </div>
    </div>
  );
}
