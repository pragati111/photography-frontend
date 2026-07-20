import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import TopHeader from "../components/TopHeader";
import { motion } from "framer-motion";
import BottomBar from "../components/BottomBar";
const API = import.meta.env.VITE_API_URL;

export default function Categories() {
  const navigate = useNavigate();
  const categoryRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const isManualScroll = useRef(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const sidebarRefs = useRef([]);

  const scrollToCategory = (index) => {
    const container = containerRef.current;
    const target = categoryRefs.current[index];

    if (container && target) {
      isManualScroll.current = true;

      const containerTop = container.getBoundingClientRect().top;
      const targetTop = target.getBoundingClientRect().top;

      const scrollOffset = targetTop - containerTop;

      container.scrollTo({
        top: container.scrollTop + scrollOffset,
        behavior: "smooth",
      });

      setActiveIndex(index);

      setTimeout(() => {
        isManualScroll.current = false;
      }, 400);
    }
  };

  useEffect(() => {
    if (categories.length === 0) return; // 🚨 wait for API data

    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualScroll.current) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);
            setActiveIndex(index);
          }
        });
      },
      {
        root: container,
        rootMargin: "-30% 0px -50% 0px",
        threshold: 0.1,
      },
    );

    categoryRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [categories]); // ✅ IMPORTANT

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${API}/api/product`,
        );
        const json = await res.json();

        const products = json.data;

        // 🔥 Transform API → UI structure
        const categoryMap = {};

        products.forEach((product) => {
          const catName = product.category?.name || "Others";
          const subName = product.subCategory?.name || "General";

          // Create category
          if (!categoryMap[catName]) {
            categoryMap[catName] = {
              name: catName,
              children: {},
            };
          }

          // Create subcategory
          if (!categoryMap[catName].children[subName]) {
            categoryMap[catName].children[subName] = {
              name: subName,
              items: [],
            };
          }

          // Push product
          categoryMap[catName].children[subName].items.push({
            id: product._id,
            name: product.productName,
            image:
              product.media?.[0]?.url || product.images?.[0] || product.image,
          });
        });

        // Convert object → array format
        const formattedCategories = Object.values(categoryMap).map((cat) => ({
          name: cat.name,
          children: Object.values(cat.children),
        }));

        setCategories(formattedCategories);
        setLoading(false);
      } catch (err) {
        console.error("API Error:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const activeItem = sidebarRefs.current[activeIndex];

    if (activeItem) {
      activeItem.scrollIntoView({
        behavior: "smooth",
        block: "center", // 👈 THIS makes it feel premium
      });
    }
  }, [activeIndex]);

  if (loading) {
    return (
      <>
        <TopHeader />

        <div className="mt-16 md:mt-20 flex h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] bg-gray-50 overflow-hidden">
          {/* LEFT SIDEBAR SHIMMER */}
          <div className="w-[20%] min-w-[85px] max-w-[110px] h-full bg-white border-r border-gray-200 flex flex-col items-center py-2 space-y-3">
            {[...Array(11)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center space-y-1 animate-pulse"
              >
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div className="w-12 h-2 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>

          {/* RIGHT CONTENT SHIMMER */}
          <div className="w-[80%] p-3 space-y-6 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                {/* Category title line */}
                <div className="flex items-center mb-4">
                  <div className="flex-1 h-[1px] bg-gray-200"></div>
                  <div className="mx-3 w-20 h-2 bg-gray-200 rounded"></div>
                  <div className="flex-1 h-[1px] bg-gray-200"></div>
                </div>

                {/* Subcategory title */}
                <div className="w-24 h-3 bg-gray-200 rounded mb-3"></div>

                {/* GRID */}
                <div className="grid grid-cols-3 gap-3">
                  {[...Array(6)].map((_, j) => (
                    <div
                      key={j}
                      className="flex flex-col items-center animate-pulse"
                    >
                      <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                      <div className="w-10 h-2 bg-gray-200 rounded mt-2"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <TopHeader />

      <div className="mt-16 md:mt-20 flex h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] bg-gray-50 overflow-hidden">
        {/* ================= LEFT SIDEBAR ================= */}
        <div className="mt-0.2 w-[20%] min-w-[85px] max-w-[110px] flex-shrink-0 h-full min-h-0 overflow-y-auto pb-20 bg-white border-r border-gray-200 no-scrollbar">
          {categories.map((cat, index) => (
            <motion.div
              key={index}
              ref={(el) => (sidebarRefs.current[index] = el)} // ✅ ADD THIS
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToCategory(index)}
              className={`relative px-1 py-2 cursor-pointer flex flex-col items-center justify-center ${
                activeIndex === index
                  ? "bg-gray-100 text-black"
                  : "text-gray-600"
              }`}
            >
              {/* Active indicator */}
              {activeIndex === index && (
                <div className="absolute left-0 top-0 h-full w-[3px] bg-black rounded-full" />
              )}

              {/* Icon */}
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
                <img
                  src={
                    cat.children?.[0]?.items?.[0]?.image ||
                    "https://via.placeholder.com/50"
                  }
                  alt="icon"
                  className="w-6 h-6 object-contain"
                />
              </div>

              {/* Name */}
              <span className="text-[11px] text-center leading-tight line-clamp-2 mt-1">
                {cat.name}
              </span>
            </motion.div>
          ))}
        </div>

        {/* ================= RIGHT CONTENT ================= */}
        <div
          ref={containerRef}
          className="w-[80%] h-full min-h-0 overflow-y-auto p-3 space-y-8 pb-40 no-scrollbar"
        >
          {categories.map((cat, i) => (
            <div
              key={i}
              data-index={i}
              ref={(el) => (categoryRefs.current[i] = el)}
              className="scroll-mt-24"
            >
              {/* Category Title */}
              <div className="flex items-center mb-4">
                <div className="flex-1 h-[1px] bg-gray-200"></div>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="mx-3 text-[11px] tracking-widest text-gray-400 uppercase whitespace-nowrap"
                >
                  {cat.name}
                </motion.p>

                <div className="flex-1 h-[1px] bg-gray-200"></div>
              </div>

              {/* Subcategories */}
              {cat.children.map((sub, idx) => (
                <div key={idx} className="mb-5">
                  <p className="text-[13px] font-medium text-gray-700 mb-2 capitalize">
                    {sub.name}
                  </p>

                  {/* GRID */}
                  <div className="grid grid-cols-3 gap-3">
                    {sub.items.map((item, id) => (
                      <motion.div
                        key={id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          navigate(`/product/${item.id || item._id}`)
                        }
                        className="flex flex-col items-center justify-start cursor-pointer"
                      >
                        {/* IMAGE */}
                        <div className="flex items-center justify-center">
                          <div className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        {/* NAME */}
                        <p className="text-[11px] text-gray-700 text-center mt-1 leading-tight line-clamp-2 px-1">
                          {item.name}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="hidden md:block">
        <BottomBar />
      </div>
    </>
  );
}
