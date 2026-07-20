import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_API_URL;

export default function TradeShows() {
  const [groupedData, setGroupedData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API}/api/product`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) return;

        const grouped = {};

        data.data.forEach((product) => {
          const section = product?.subCategory?.section || "Other";
          const subCategory = product?.subCategory?.name || "Misc";

          if (!grouped[section]) grouped[section] = {};
          if (!grouped[section][subCategory])
            grouped[section][subCategory] = [];

          grouped[section][subCategory].push(product);
        });

        setGroupedData(grouped);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Helper: get 3 unique images from different products
  const getThreeImages = (products) => {
  const images = [];

  for (let product of products) {
    let img = null;

    // 🔥 1. FIRST: try media
    const mediaImg = product.media?.find(
      (m) => m.type === "image" && m.url
    );

    if (mediaImg) {
      img = mediaImg.url;
    }

    // 🔥 2. FALLBACK: try images array
    else if (product.images && product.images.length > 0) {
      img = product.images[0];
    }

    // ✅ Add only if valid & not duplicate
    if (img && !images.includes(img)) {
      images.push(img);
    }

    // Stop at 3 images
    if (images.length === 3) break;
  }

  // 🛟 SAFETY: never let UI break
  while (images.length < 3) {
    images.push(images[images.length - 1] || "/placeholder.jpg");
  }

  return images;
};

  return (
    <div className="px-4 md:px-8 lg:px-12 pb-10">
      {/* SHIMMER LOADING STATE */}
      {loading && (
        <div className="mb-10">
          <div className="mb-4">
            <div className="h-6 w-40 bg-gray-200 animate-pulse rounded"></div>
            <div className="w-10 h-[2px] bg-gray-200 mt-1"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-300 shadow-sm overflow-hidden p-2">
                <div className="grid grid-cols-2 gap-2 aspect-[1/0.9] sm:aspect-auto sm:h-[190px] md:h-[210px] overflow-hidden">
                  <div className="flex flex-col gap-2 h-full">
                    <div className="flex-[1.4] bg-gray-200 animate-pulse rounded"></div>
                  </div>
                  <div className="flex flex-col gap-2 h-full">
                    <div className="flex-1 bg-gray-200 animate-pulse rounded"></div>
                    <div className="flex-[1.4] bg-gray-200 animate-pulse rounded"></div>
                  </div>
                </div>
                <div className="pt-3 pb-1 text-center">
                  <div className="h-4 w-3/4 mx-auto bg-gray-200 animate-pulse rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACTUAL CONTENT */}
      {!loading && Object.entries(groupedData).map(([section, subCats]) => (
        <div key={section} className="mb-10">
          
          {/* SECTION HEADING */}
          <div className="mb-4">
            <h2 className="text-xl md:text-2xl font-semibold">
              {section}
            </h2>
            <div className="w-10 h-[2px] bg-orange-500 mt-1"></div>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {Object.entries(subCats).map(([subCatName, products], index) => {
              
              const images = getThreeImages(products);

              // skip if not enough images
              if (images.length < 3) return null;

              return (
                <div key={index} className="group cursor-pointer relative">

                  <div onClick={() => navigate(`/subcategory/${encodeURIComponent(subCatName)}`)} className="bg-white border border-gray-300 shadow-sm overflow-hidden p-2 transition duration-300 group-hover:shadow-lg">

                    {/* MOSAIC */}
                    <div className="grid grid-cols-2 gap-2 aspect-[1/0.9] sm:aspect-auto sm:h-[190px] md:h-[210px] overflow-hidden">
                      
                      {/* LEFT */}
                      <div className="flex flex-col gap-2 h-full">
                        <div className="flex-[1.4] overflow-hidden">
                          <img
                            src={images[0]}
                            alt={subCatName}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        </div>
                      </div>

                      {/* RIGHT */}
                      <div className="flex flex-col gap-2 h-full">
                        <div className="flex-1 overflow-hidden">
                          <img
                            src={images[1]}
                            alt={subCatName}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        </div>

                        <div className="flex-[1.4] overflow-hidden">
                          <img
                            src={images[2]}
                            alt={subCatName}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        </div>
                      </div>
                    </div>

                    {/* HOVER */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                      <span className="text-white text-sm border border-gray-200 px-3 py-1">
                        View More →
                      </span>
                    </div>

                    {/* TITLE */}
                    <div className="pt-3 pb-1 text-center">
                      <p className="text-sm font-medium">
                        {subCatName}
                      </p>
                    </div>                    

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}