import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_API_URL;

export default function WorkspaceBranding() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(4);
  const navigate = useNavigate();

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${API}/api/product`,
        );
        const data = await res.json();

        if (data?.success) {
          const featured = data.data.filter(
            (p) =>
              p.tags?.includes("featured") || p.superTags?.includes("featured"),
          );

          const formatted = featured.map((p) => ({
            _id: p._id,
            name: p.name,
            images: (p.media || [])
              .filter((m) => m.type === "image")
              .map((m) => m.url)
              .slice(0, 6),
          }));

          setProducts(formatted);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Responsive handling
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleItems(1);
      } else if (window.innerWidth < 1024) {
        setVisibleItems(2);
      } else {
        setVisibleItems(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const next = () => {
    if (index + visibleItems < products.length) {
      setIndex((prev) => prev + 1);
    }
  };

  const prev = () => {
    if (index > 0) {
      setIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="py-8">
      {/* HEADER */}
      <div className="px-4 md:px-8 lg:px-12">
        <div className="mb-4">
          <h2 className="text-xl md:text-2xl font-semibold">
            Featured Products
          </h2>
          <div className="w-10 h-[3px] bg-orange-500 mt-1"></div>
        </div>
      </div>

      {/* SLIDER */}
      <div className="relative">
        <div className="px-4 md:px-8 lg:px-12">
          {/* SHIMMER LOADING STATE */}
          {loading && (
            <div className="flex gap-4 overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)] flex-shrink-0"
                >
                  <div className="bg-white border border-[#e6d3b8] p-3 shadow-md rounded-md">
                    <div className="animate-pulse">
                      {/* TILE GRID SKELETON */}
                      <div className="grid grid-cols-3 grid-rows-3 gap-1.5 h-[250px] sm:h-[250px]">
                        <div className="col-span-2 row-span-2 bg-gray-200 rounded"></div>
                        <div className="bg-gray-200 rounded"></div>
                        <div className="bg-gray-200 rounded"></div>
                        <div className="bg-gray-200 rounded"></div>
                        <div className="bg-gray-200 rounded"></div>
                        <div className="bg-gray-200 rounded"></div>
                      </div>
                      {/* TITLE SKELETON */}
                      <div className="h-4 w-3/4 mx-auto mt-2 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ACTUAL PRODUCTS */}
          {!loading && products.length > 0 && (
            <div className="flex gap-4 overflow-hidden">
              {products.slice(index, index + visibleItems).map((item, i) => (
              <div
                key={i}
                onClick={() => navigate(`/product/${item._id}`)}
                className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)] flex-shrink-0 cursor-pointer"
              >
                {/* BORDER WRAPPER (stays stable) */}
                <div className="bg-white border border-[#e6d3b8] p-3 shadow-md hover:shadow-lg transition-all duration-300 ease-out rounded-md">
                  {/* INNER CONTENT (scales smoothly) */}
                  <div className="transition-transform duration-300 ease-out hover:scale-[1.03]">
                    {/* TILE GRID */}
                    <div className="grid grid-cols-3 grid-rows-3 gap-1.5 h-[250px] sm:h-[250px]">
                      <img
                        src={item.images?.[0]}
                        className="col-span-2 row-span-2 w-full h-full object-cover"
                      />
                      <img
                        src={item.images?.[1]}
                        className="w-full h-full object-cover"
                      />
                      <img
                        src={item.images?.[2]}
                        className="w-full h-full object-cover"
                      />
                      <img
                        src={item.images?.[3]}
                        className="w-full h-full object-cover"
                      />
                      <img
                        src={item.images?.[4]}
                        className="w-full h-full object-cover"
                      />
                      <img
                        src={item.images?.[5]}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* TITLE */}
                    <p className="text-sm mt-2 text-center font-medium">
                      {item.name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}

          {/* PREV */}
          {!loading && products.length > 0 && index > 0 && (
            <button
              onClick={prev}
              className="absolute left-2 md:-left-4 top-1/2 -translate-y-1/2 bg-white border p-2 shadow rounded-full"
            >
              <ChevronLeft size={18} />
            </button>
          )}

          {/* NEXT */}
          {!loading && products.length > 0 && index + visibleItems < products.length && (
            <button
              onClick={next}
              className="absolute right-2 md:-right-4 top-1/2 -translate-y-1/2 bg-white border p-2 shadow rounded-full"
            >
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
