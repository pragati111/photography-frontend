import { useState } from "react";
import { categories } from "../data/categories";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
const API = import.meta.env.VITE_API_URL;

export default function Sidebar() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);

    fetch(`${API}/api/product`)
      .then((res) => res.json())
      .then((res) => {
        const structured = transformData(res.data);

        setCategories(structured);

        // ✅ OPEN FIRST CATEGORY BY DEFAULT
        if (structured.length > 0) {
          setActiveIndex(0);
        }

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const transformData = (products) => {
    console.log(categories);
    const map = {};

    products.forEach((p) => {
      const catName = p.category?.name || "Other";
      const subName = p.subCategory?.name || "General";

      // create category
      if (!map[catName]) {
        map[catName] = {
          name: catName,
          children: {},
        };
      }

      // create subcategory
      if (!map[catName].children[subName]) {
        map[catName].children[subName] = {
          name: subName,
          items: [],
        };
      }

      // push product as item
      map[catName].children[subName].items.push({
        id: p._id,
        name: p.productName || p.name,
        image:
          p.images?.[0] || p.media?.find((m) => m.type === "image")?.url || "",
      });
    });

    // convert object → array
    return Object.values(map).map((cat) => ({
      ...cat,
      children: Object.values(cat.children),
    }));
  };

  if (loading) {
  return (
    <div className="hidden lg:block w-[240px] fixed top-[72px] left-0 h-[calc(100vh-72px)] bg-gray-100 border-r overflow-y-auto text-xs animate-pulse">
      
      {/* HOME */}
      <div className="mt-2 px-3 py-3 border-b bg-white">
        <div className="h-3 w-20 bg-gray-300 rounded"></div>
      </div>

      {/* CATEGORY LIST */}
      {[1, 2, 3, 4, 5].map((_, i) => (
        <div key={i} className="border-b">
          
          {/* CATEGORY HEADER */}
          <div className="px-3 py-3 flex justify-between items-center">
            <div className="h-3 w-24 bg-gray-300 rounded"></div>
            <div className="h-3 w-3 bg-gray-300 rounded"></div>
          </div>

          {/* EXPANDED MOCK */}
          {i === 0 && (
            <div className="px-2 py-2 space-y-3 bg-white">
              
              {[1, 2].map((_, j) => (
                <div key={j}>
                  
                  {/* SUBCATEGORY NAME */}
                  <div className="h-3 w-20 bg-gray-300 rounded mb-2"></div>

                  {/* ITEMS GRID */}
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2, 3, 4].map((_, k) => (
                      <div
                        key={k}
                        className="bg-gray-50 p-2 rounded-md"
                      >
                        <div className="h-[45px] bg-gray-300 rounded mb-1"></div>
                        <div className="h-2 bg-gray-300 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

  return (
    <div className="hidden lg:block w-[240px] fixed top-[72px] left-0 h-[calc(100vh-72px)] bg-gray-100 border-r overflow-y-auto text-xs">
      <div
        className="mt-2 px-3 py-2 border-b font-medium bg-white cursor-pointer hover:bg-gray-50"
        onClick={() => navigate("/")}
      >
        🏠 Home
      </div>

      {categories.map((cat, i) => (
        <div key={i} className="border-b">
          {/* Category */}
          <div
            onClick={() => setActiveIndex(i)}
            className={`px-3 py-2 cursor-pointer flex justify-between items-center
              ${
                activeIndex === i
                  ? "bg-white text-orange-500 font-semibold"
                  : "hover:bg-gray-200"
              }`}
          >
            <span className="truncate">{cat.name}</span>
            <ChevronDown
              size={14}
              className={`transition-transform duration-300 ${
                activeIndex === i ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* Expanded */}
          {activeIndex === i && (
            <div className="px-2 py-2 space-y-3 bg-white max-h-[300px] overflow-y-auto">
              {cat.children.map((sub, idx) => (
                <div key={idx}>
                  <p className="font-semibold text-[11px] mb-1 text-gray-700 truncate">
                    {sub.name}
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    {sub.items.map((item, id) => (
                      <div
                        key={id}
                        onClick={() => navigate(`/product/${item.id}`)}
                        className="bg-gray-50 p-2 rounded-md text-center hover:bg-white hover:shadow cursor-pointer"
                      >
                        <div className="h-[45px] flex items-center justify-center mb-1">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="max-h-full object-contain"
                          />
                        </div>

                        <p className="text-[10px] leading-tight text-gray-600 truncate">
                          {item.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
