import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_API_URL;

const API_FINAL = `${API}/api/product`;

export default function SearchComponent({ isMobileTrigger = false }) {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const searchRef = useRef();

  const getProductImage = (item) => {
    // 1️⃣ media array
    if (item.media && item.media.length > 0) {
      const img = item.media.find((m) => m.type === "image");
      if (img?.url) return img.url;
    }

    // 2️⃣ images array
    if (item.images && item.images.length > 0) {
      return item.images[0];
    }

    // 3️⃣ single image field
    if (item.image) {
      return item.image;
    }

    // ❌ nothing found
    return null;
  };

  const getRandomColor = (name = "") => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-yellow-500",
    ];

    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // ✅ Fetch once
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);

        const res = await fetch(API_FINAL);
        const data = await res.json();

        setAllProducts(data?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // ✅ Search logic
  const handleSearch = (value) => {
    if (loadingProducts) return;
    const q = value.toLowerCase();

    if (!q.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const filtered = allProducts.filter((item) => {
      return (
        item.name?.toLowerCase().includes(q) ||
        item.productName?.toLowerCase().includes(q)
      );
    });

    setResults(filtered);
    setShowResults(true);
  };

  // ✅ Debounce
  useEffect(() => {
  if (loadingProducts) return;

  const delay = setTimeout(() => {
    handleSearch(query);
  }, 300);

  return () => clearTimeout(delay);
}, [query, loadingProducts]);

  // ✅ Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Highlight match
  const highlight = (text) => {
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));

    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="bg-yellow-200">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  // =========================
  // 🖥️ DESKTOP SEARCH
  // =========================
  if (!isMobileTrigger) {
    return (
      <div ref={searchRef} className="w-full max-w-xl relative">
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-400 transition">
          <input
            type="text"
            placeholder="Search for products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent outline-none flex-1 text-sm"
          />

          <button
            onClick={() => handleSearch(query)}
            className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:scale-105 transition-all"
          >
            <Search size={18} />
          </button>
        </div>

        {/* RESULTS */}
        {showResults && (
          <div className="absolute top-12 w-full bg-white shadow-xl rounded-xl max-h-80 overflow-y-auto z-50">
            {loadingProducts ? (
              <div className="p-6 text-center text-gray-400 text-sm">
                Loading products...
              </div>
            ) : results.length > 0 ? (
              results.map((item) => (
                <div
                  key={item._id}
                  onClick={() => {
                    navigate(`/product/${item._id}`);
                    setShowResults(false);
                  }}
                  className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                >
                  {getProductImage(item) ? (
                    <img
                      src={getProductImage(item)}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-semibold ${getRandomColor(
                        item.name,
                      )}`}
                    >
                      {item.name?.[0]?.toUpperCase() || "P"}
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium">
                      {highlight(item.name)}
                    </p>
                    <p className="text-xs text-gray-500">₹{item.price}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-400 text-sm">
                No products found for "<b>{query}</b>"
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // =========================
  // 📱 MOBILE SEARCH
  // =========================
  return (
    <>
      {/* ICON */}
      <button
        onClick={() => setMobileOpen(true)}
        className="p-2 rounded-full hover:bg-gray-100 transition"
      >
        <Search size={21} />
      </button>

      {/* OVERLAY */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-white z-50 p-4">
          <div className="flex items-center gap-2">
            <input
              autoFocus
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 border rounded-full px-4 py-2"
            />

            <button
              onClick={() => handleSearch(query)}
              className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center"
            >
              <Search size={18} />
            </button>

            <button
              onClick={() => setMobileOpen(false)}
              className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
            >
              <X size={18} />
            </button>
          </div>

          {/* RESULTS */}
          <div className="mt-4">
            {loadingProducts ? (
              <div className="text-center text-gray-400 mt-6">
                Loading products...
              </div>
            ) : results.length > 0 ? (
              results.map((item) => (
                <div
                  key={item._id}
                  onClick={() => {
                    navigate(`/product/${item._id}`);
                    setMobileOpen(false);
                  }}
                  className="p-3 border-b flex gap-3 cursor-pointer 
                            hover:bg-gray-100 
                            active:bg-gray-100 active:scale-[0.98] 
                            transition"
                >
                  {getProductImage(item) ? (
                    <img
                      src={getProductImage(item)}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-semibold ${getRandomColor(
                        item.name,
                      )}`}
                    >
                      {item.name?.[0]?.toUpperCase() || "P"}
                    </div>
                  )}

                  <div>
                    <p className="text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">₹{item.price}</p>
                  </div>
                </div>
              ))
            ) : (
              query && (
                <div className="text-center text-gray-400 mt-6">
                  No products found 😕
                </div>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
}
