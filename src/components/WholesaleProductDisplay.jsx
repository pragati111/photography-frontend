import { useParams, useLocation } from "react-router-dom";
import Sidebar from "./SideBar";
import TopHeader from "./TopHeader";
import BottomBar from "./BottomBar";
import { useEffect, useState, useRef } from "react";
import { useWholesaleCart } from "../redux/useWholesaleCart";
import ProductShimmer from "./ProductShimmer";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { Info } from "lucide-react";
const API = import.meta.env.VITE_API_URL;

export default function WholesaleProductDisplay() {
  const { addToWholesaleCart } = useWholesaleCart();
  const { id } = useParams();
  const location = useLocation();

  const [product, setProduct] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [configs, setConfigs] = useState([{}]);
  const [showAllOffers, setShowAllOffers] = useState(false);
  const [offerCountdown, setOfferCountdown] = useState("");
  const auth = useAuth();
  const { token } = auth;
  const currentUser = auth.user;

  const thumbnailRefs = useRef([]);
  const rightRef = useRef(null);
  const [appliedOffers, setAppliedOffers] = useState([]);
  const [savedCartConfigs, setSavedCartConfigs] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const isAlreadyInCart = configs.some((c) => c.designId);

  const getPreviewSrc = (value) =>
    typeof value === "string" ? value : URL.createObjectURL(value);

  const getTotalQuantity = () => {
    return configs.reduce((total, config) => {
      return total + (config.quantity || 1);
    }, 0);
  };

  const getWholesaleBasePrice = () => {
    if (!product) return 0;

    const wholesalerId = currentUser?._id;
    const wholesalerPin = currentUser?.pin;
    const wholesalerEmail = currentUser?.email;

    const match = product.wholesalerPrices?.find((item) => {
      const id = item.wholesalerId?._id;
      const pin = item.wholesalerId?.pin;
      const email = item.wholesalerId?.email;

      return (
        (wholesalerId && wholesalerId === id) ||
        (wholesalerPin && wholesalerPin === pin) ||
        (wholesalerEmail && wholesalerEmail === email)
      );
    });

    if (match?.wholesalePrice > 0) {
      return match.wholesalePrice;
    }

    if (product.wholeSalerDefault > 0) {
      return product.wholeSalerDefault;
    }

    return product.discountedMRP > 0
      ? product.discountedMRP
      : product.price ?? 0;
  };

  const isShowingRetailPrice = () => {
    if (!product) return false;

    const matchedPrice = product.wholesalerPrices?.find((item) => {
      const id = item.wholesalerId?._id;
      const pin = item.wholesalerId?.pin;
      const email = item.wholesalerId?.email;
      const wholesalerId = currentUser?._id;
      const wholesalerPin = currentUser?.pin;
      const wholesalerEmail = currentUser?.email;

      return (
        (wholesalerId && wholesalerId === id) ||
        (wholesalerPin && wholesalerPin === pin) ||
        (wholesalerEmail && wholesalerEmail === email)
      );
    })?.wholesalePrice;

    return (
      (!matchedPrice || matchedPrice === 0) &&
      (!product.wholeSalerDefault || product.wholeSalerDefault === 0) &&
      product.discountedMRP > 0
    );
  };

  const isShowingWholesaleDefaultPrice = () => {
    if (!product) return false;

    const matchedPrice = product.wholesalerPrices?.find((item) => {
      const id = item.wholesalerId?._id;
      const pin = item.wholesalerId?.pin;
      const email = item.wholesalerId?.email;
      const wholesalerId = currentUser?._id;
      const wholesalerPin = currentUser?.pin;
      const wholesalerEmail = currentUser?.email;

      return (
        (wholesalerId && wholesalerId === id) ||
        (wholesalerPin && wholesalerPin === pin) ||
        (wholesalerEmail && wholesalerEmail === email)
      );
    })?.wholesalePrice;

    return (!matchedPrice || matchedPrice === 0) && product.wholeSalerDefault > 0;
  };

  const getBasePrice = () => {
    return getWholesaleBasePrice();
  };

  const getPriceWithAdjustment = (config) => {
    return getBasePrice() + getAdjustment(config);
  };

  const markUnsavedChanges = () => {
    if (savedCartConfigs.length > 0 || isAlreadyInCart) {
      setHasUnsavedChanges(true);
    }
  };

  const isFieldComplete = (config, field) => {
    const value = config[field.label];

    if (field.type === "checkbox") {
      return Array.isArray(value) && value.length > 0;
    }

    if (field.type === "file") {
      const selectedOption = Object.values(config).find(
        (val) => val === "Double Sided" || val === "Single Sided",
      );

      if (selectedOption === "Single Sided") {
        return Boolean(value);
      }

      if (selectedOption === "Double Sided") {
        return Boolean(config[`${field.label}_front`]) &&
          Boolean(config[`${field.label}_back`]);
      }

      return Boolean(value);
    }

    return value !== undefined && value !== null && value !== "";
  };

  const isConfigComplete = (config) => {
    if (!product?.customizations?.length) return true;
    return product.customizations.every((field) =>
      isFieldComplete(config, field),
    );
  };

  const isFormComplete = () => configs.every((config) => isConfigComplete(config));

  const formatConfigs = () =>
    configs.map((c) => {
      const designId = c.designId || crypto.randomUUID();
      const cleanedConfig = { ...c };

      delete cleanedConfig.quantity;
      delete cleanedConfig.designId;

      return {
        designId,
        config: cleanedConfig,
        quantity: c.quantity || 1,
      };
    });

  const handleApplyOffer = (offer) => {
    // already applied
    if (appliedOffers.find((o) => o._id === offer._id)) return;

    const title = offer.title?.toLowerCase() || "";

    // match: Buy 2 or more
    const match = title.match(/buy\s+(\d+)\s+or\s+more/i);

    // IF OFFER HAS BUY CONDITION
    if (match) {
      const requiredQty = Number(match[1]);

      const totalQty = getTotalQuantity();

      if (totalQty < requiredQty) {
        toast.error(`Minimum quantity ${requiredQty} required for this offer`);
        return;
      }

      // 🔥 REMOVE OLD "BUY X OR MORE" OFFERS
      setAppliedOffers((prev) => {
        const filtered = prev.filter((existingOffer) => {
          const existingTitle = existingOffer.title?.toLowerCase() || "";

          // remove old buy-x offers
          return !existingTitle.match(/buy\s+(\d+)\s+or\s+more/i);
        });

        return [...filtered, offer];
      });
      markUnsavedChanges();
      return;
    }

    // NORMAL OFFERS
    setAppliedOffers((prev) => [...prev, offer]);
    markUnsavedChanges();
  };

  const getAdjustment = (config) => {
    let extra = 0;

    product.customizations?.forEach((field) => {
      const selected = config[field.label];

      if (!selected) return;

      // MULTI (checkbox)
      if (Array.isArray(selected)) {
        selected.forEach((val) => {
          const opt = field.options?.find((o) => o.label === val);
          extra += opt?.priceAdjustment || 0;
        });
      }
      // SINGLE (dropdown/radio)
      else {
        const opt = field.options?.find((o) => o.label === selected);
        extra += opt?.priceAdjustment || 0;
      }
    });

    return extra;
  };

  const getTotalPrice = () => {
    if (!product) return 0;

    return configs.reduce((total, config) => {
      const base = getPriceWithAdjustment(config);
      const quantity = config.quantity || 1;

      let price = base;

      appliedOffers.forEach((offer) => {
        if (offer.discountPercent) {
          price = price - (price * offer.discountPercent) / 100;
        }
      });

      return total + price * quantity;
    }, 0);
  };

  const getSpecificationValue = (key, fallback = "") => {
    if (!product?.specifications?.length) return fallback;

    const normalizedKey = key?.trim().toLowerCase();
    const specification = product.specifications.find(
      (item) => item?.key?.trim().toLowerCase() === normalizedKey,
    );

    return specification?.value ?? fallback;
  };

  const reservedSpecificationKeys = new Set([
    "name",
    "price",
    "category",
    "country of origin",
    "type",
    "brand",
    "brand ",
  ]);

  const extraSpecifications =
    product?.specifications?.filter((item) => {
      const key = item?.key?.trim().toLowerCase();
      return key && !reservedSpecificationKeys.has(key);
    }) || [];

  // AUTO REMOVE INVALID BUY-X OFFERS
  useEffect(() => {
    const totalQty = getTotalQuantity();

    setAppliedOffers((prev) => {
      const updatedOffers = prev.filter((offer) => {
        const title = offer.title?.toLowerCase() || "";

        const match = title.match(/buy\s+(\d+)\s+or\s+more/i);

        // normal offers stay applied
        if (!match) return true;

        const requiredQty = Number(match[1]);

        // REMOVE if quantity became invalid
        if (totalQty < requiredQty) {
          return false;
        }

        return true;
      });

      return updatedOffers;
    });
  }, [configs]);

  // FETCH PRODUCT
  useEffect(() => {
    fetch(`${API}/api/product/${id}`)
      .then((res) => res.json())
      .then((res) => {
        console.log("API:", res); // debug once
        setProduct(res.product || null); // ✅ FIX
      })
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    const hydrateFromCart = async () => {
      if (!currentUser?._id || !product?._id) return;

      try {
        const res = await axios.get(
          `${API}/api/cart?userId=${currentUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const items = res.data.items || [];

        // find same product
        const existingProduct = items.find(
          (item) => item.productId.toString() === product._id.toString(),
        );

        // no product in cart
        if (!existingProduct) {
          setConfigs([{}]);
          setAppliedOffers([]);
          setSavedCartConfigs([]);
          setHasUnsavedChanges(false);
          return;
        }

        // restore configs
        const restoredConfigs = existingProduct.designs.map((d) => ({
  ...d.config,
  quantity: d.quantity || 1,
  designId: d.designId,
}));

        const finalConfigs = restoredConfigs.length > 0 ? restoredConfigs : [{}];
        setConfigs(finalConfigs);
        setSavedCartConfigs(finalConfigs);
        setHasUnsavedChanges(false);

        // restore offers
        const allOffers = [];

        existingProduct.designs.forEach((d) => {
          (d.offers || []).forEach((offer) => {
            if (!allOffers.find((o) => o._id === offer._id)) {
              allOffers.push(offer);
            }
          });
        });

        setAppliedOffers(allOffers);
      } catch (err) {
        console.error("Failed to hydrate cart product", err);
      }
    };

    hydrateFromCart();
  }, [location.key, product, currentUser?._id, token]);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = "You have unsaved changes. Do you really want to leave?";
    };

    if (hasUnsavedChanges) {
      window.addEventListener("beforeunload", handler);
    } else {
      window.removeEventListener("beforeunload", handler);
    }

    return () => window.removeEventListener("beforeunload", handler);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    const attachScroll = () => {
      const left = document.querySelector("#left-section");

      if (!left || !rightRef.current) return;

      const handler = (e) => {
        const el = rightRef.current;

        const isScrollingDown = e.deltaY > 0;
        const isScrollingUp = e.deltaY < 0;

        const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 5;

        const atTop = el.scrollTop <= 5;

        if ((isScrollingDown && !atBottom) || (isScrollingUp && !atTop)) {
          e.preventDefault();
          el.scrollTop += e.deltaY;
        }
      };

      left.addEventListener("wheel", handler, { passive: false });

      return () => {
        left.removeEventListener("wheel", handler);
      };
    };

    // 🔥 IMPORTANT: delay until DOM + product render
    const timeout = setTimeout(attachScroll, 100);

    return () => clearTimeout(timeout);
  }, [product]); // 👈 THIS is the key

  // THUMB SCROLL
  useEffect(() => {
    const currentThumb = thumbnailRefs.current[activeIndex];
    currentThumb?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activeIndex]);

  const activeOffers =
    product?.offers?.filter((o) => {
      // must be active
      if (!o.active) return false;

      // only wholesale offers on the wholesale product page
      if (o.wholesaleApplicable !== true) return false;

      // if no expiry date → still show
      if (!o.expiryDate) return true;

      // compare dates
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const expiry = new Date(o.expiryDate);
      expiry.setHours(23, 59, 59, 999);

      // show only if not expired
      return expiry >= today;
    }) || [];

  const soonestExpiringOffer = activeOffers.reduce((earliest, offer) => {
    if (!offer.expiryDate) return earliest;

    const expiryTime = Date.parse(offer.expiryDate);
    if (Number.isNaN(expiryTime)) return earliest;

    if (!earliest) return offer;

    const earliestExpiry = Date.parse(earliest.expiryDate);
    return expiryTime < earliestExpiry ? offer : earliest;
  }, null);

  const formatTimeLeft = (milliseconds) => {
    if (milliseconds <= 0) return "0 day(s): 00h: 00m: 00s";
    const totalSeconds = Math.floor(milliseconds / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (value) => String(value).padStart(2, "0");
    return `${days} day(s): ${pad(hours)}h: ${pad(minutes)}m: ${pad(seconds)}s`;
  };

  useEffect(() => {
    if (!soonestExpiringOffer?.expiryDate) {
      setOfferCountdown("");
      return;
    }

    const updateCountdown = () => {
      const expiryTime = new Date(soonestExpiringOffer.expiryDate).getTime();
      const diff = expiryTime - Date.now();
      setOfferCountdown(formatTimeLeft(diff));
    };

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);
    return () => clearInterval(intervalId);
  }, [soonestExpiringOffer]);

  if (!product) return <ProductShimmer />;
  const canSubmit = isFormComplete();

  const media =
    product.media?.length > 0
      ? product.media
      : product.images?.map((img) => ({ type: "image", url: img })) || [];

  const activeMedia = media[activeIndex];

  // HANDLERS
  const handleChange = (index, field, value) => {
    const updated = [...configs];

    // 👇 quantity should still work
    const key = typeof field === "string" ? field : field.label;

    updated[index][key] = value;

    setConfigs(updated);
    markUnsavedChanges();
  };

  const CLOUDINARY_UPLOAD_PRESET = "market_data";
  const CLOUDINARY_CLOUD_NAME = "dbyccutew";

  const handleFileUpload = async (index, key, file) => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();

      // ✅ SAVE CLOUDINARY URL IN CONFIG
      handleChange(index, key, data.secure_url);
      markUnsavedChanges();
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const addConfig = () => {
    setConfigs((prev) => [...prev, {}]);
    markUnsavedChanges();
  };

  const removeConfig = (index) => {
    if (configs.length === 1) return; // prevent deleting last
    setConfigs((prev) => prev.filter((_, i) => i !== index));
    markUnsavedChanges();
  };

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % media.length);

  const handlePrev = () =>
    setActiveIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));

  return (
    <div>
      <TopHeader />

      <div className="flex">
        {/* DESKTOP SIDEBAR */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <div className="w-full lg:ml-[240px] pt-[100px] px-4 lg:px-6 pb-[80px] lg:pb-0">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* LEFT */}
            <div id="left-section" className="w-full lg:w-[420px]">
              <div className="relative h-[320px] lg:h-[420px] bg-white border rounded flex items-center justify-center">
                <button
                  onClick={handlePrev}
                  className="absolute left-3 bg-white/90 hover:bg-white text-black w-8 h-8 flex items-center justify-center rounded-full shadow-md"
                >
                  ‹
                </button>

                {activeMedia ? (
                  activeMedia.type === "image" ? (
                    <img
                      src={activeMedia.url}
                      className="max-h-full object-contain"
                    />
                  ) : (
                    <video src={activeMedia.url} autoPlay muted loop controls />
                  )
                ) : (
                  <div className="text-gray-400">No media available</div>
                )}

                <button
                  onClick={handleNext}
                  className="absolute right-3 bg-white/90 hover:bg-white text-black w-8 h-8 flex items-center justify-center rounded-full shadow-md"
                >
                  ›
                </button>
              </div>

              {/* THUMB */}
              <div className="mt-4 flex gap-3 overflow-x-auto no-scrollbar">
                {media.map((item, i) => (
                  <div
                    key={i}
                    ref={(el) => (thumbnailRefs.current[i] = el)}
                    onClick={() => setActiveIndex(i)}
                    className={`w-[70px] h-[70px] flex-shrink-0 border cursor-pointer ${
                      activeIndex === i ? "border-black" : ""
                    }`}
                  >
                    <img
                      src={item.url}
                      className="object-cover h-full w-full"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT */}
            <div
              ref={rightRef}
              className="flex-1 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)] pr-2 no-scrollbar"
            >
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl lg:text-2xl font-semibold">
                  {product.productName || product.name}
                </h1>

                {soonestExpiringOffer && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-50 to-violet-50 border border-pink-200 px-3 py-1 text-sm text-slate-800 shadow-sm">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-pink-600 shadow-sm">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 animate-spin"
                      >
                        <path d="M12 6v6l4 2" />
                        <path d="M12 20a8 8 0 1 1 0-16" />
                      </svg>
                    </span>
                    <span className="font-semibold leading-none">
                      {soonestExpiringOffer.title}
                      {offerCountdown ? ` · ${offerCountdown}` : ""}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <p className="text-green-600 text-2xl lg:text-3xl font-bold">
                  ₹{getBasePrice()}
                </p>
              </div>

              {isShowingRetailPrice() && (
                <div className="mt-3 flex items-start gap-2 rounded-3xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-700">
                  <Info size={18} className="mt-0.5 shrink-0 text-orange-600" />
                  <div>
                    <p className="font-semibold">This is the retail price.</p>
                    <p>
                      To get the wholesale price contact on this number regarding this product.
                    </p>
                  </div>
                </div>
              )}

              {isShowingWholesaleDefaultPrice() && (
                <div className="mt-3 flex items-start gap-2 rounded-3xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
                  <Info size={18} className="mt-0.5 shrink-0 text-blue-600" />
                  <div>
                    <p className="font-semibold">This is the default wholesale price.</p>
                    <p>
                      In case this wholesale price is not satisfactory to you please contact on this number.
                    </p>
                  </div>
                </div>
              )}

              <p className="text-gray-600 text-sm leading-relaxed break-all">
                {product.description}
              </p>
              {activeOffers.length > 0 && (
                <>
                  {/* OFFERS SECTION */}
                  <h3 className="text-lg  font-semibold">All Offers</h3>
                  <div className="w-full overflow-x-auto no-scrollbar">
                    <div className="flex gap-4 p-2">
                      {(activeOffers.length > 3
                        ? activeOffers.slice(0, 2)
                        : activeOffers
                      ).map((offer) => {
                    const isApplied = appliedOffers.some(
                      (o) => o._id === offer._id,
                    );

                    return (
                      <div
                        key={offer._id}
                        onClick={() => !isApplied && handleApplyOffer(offer)}
                        className={`
    relative flex-shrink-0 
    w-[170px]
    rounded-2xl
    px-4 py-4
    bg-white/80 backdrop-blur-xl
    border border-gray-100
    shadow-sm
    hover:shadow-md
    transition-all duration-300
    cursor-pointer
    overflow-hidden

    ${isApplied ? "opacity-60 pointer-events-none" : "hover:-translate-y-1"}
  `}
                      >
                        {/* SOFT TOP ACCENT */}
                        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-pink-400 via-violet-500 to-indigo-500"></div>

                        {/* APPLIED BADGE */}
                        {isApplied && (
                          <div className="absolute top-2 right-2 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                            Applied
                          </div>
                        )}

                        {/* OFFER TITLE */}
                        <p className="mt-3 text-sm font-semibold text-gray-800 leading-snug line-clamp-2">
                          {offer.title}
                        </p>

                        {/* DISCOUNT */}
                        {offer.discountPercent > 0 && (
                          <div className="mt-4">
                            <p className="text-[26px] font-black bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent leading-none">
                              {offer.discountPercent}%
                            </p>

                            {offer.expiryDate && (
                              <p className="text-[10px] text-gray-400 mt-1 tracking-wide">
                                Valid till{" "}
                                {new Date(offer.expiryDate).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "short",
                                  },
                                )}
                              </p>
                            )}
                          </div>
                        )}

                        {/* MINI BOTTOM DECOR */}
                        <div className="mt-4 flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-pink-400"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-violet-400"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                        </div>
                      </div>
                    );
                  })}

                  {/* ✅ VIEW MORE CARD */}
                  {/* ✅ VIEW MORE CARD */}
                  {activeOffers.length > 3 && (
                    <div
                      onClick={() => setShowAllOffers(true)}
                      className="
      relative flex-shrink-0
      w-[170px]
      rounded-2xl
      px-4 py-4
      bg-gradient-to-br from-violet-50 via-pink-50 to-indigo-50
      border border-white/80
      shadow-sm
      hover:shadow-lg
      transition-all duration-300
      cursor-pointer
      overflow-hidden
      hover:-translate-y-1
      group
    "
                    >
                      {/* TOP ACCENT */}
                      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-pink-400 via-violet-500 to-indigo-500"></div>

                      {/* GLOW */}
                      <div className="absolute -top-8 -right-8 w-20 h-20 bg-pink-200/40 rounded-full blur-2xl group-hover:scale-125 transition duration-500"></div>

                      {/* PLUS ICON */}
                      <div className="relative z-10 w-11 h-11 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mt-2">
                        <span className="text-2xl font-light text-violet-600">
                          +
                        </span>
                      </div>

                      {/* TEXT */}
                      <div className="relative z-10 text-center mt-4">
                        <p className="text-sm font-semibold text-gray-800">
                          More Offers
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          tap to explore
                        </p>
                      </div>

                      {/* MINI DECOR */}
                      <div className="relative z-10 mt-4 flex items-center justify-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-400"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-400"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

              {/* CUSTOMIZATION */}
              <div>
                <h2 className="text-lg font-semibold mb-3">Customize</h2>

                <div className="space-y-4">
                  {configs.map((config, index) => (
                    <div
                      key={index}
                      className="border p-4 rounded space-y-3 relative"
                    >
                      {/* TITLE */}
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Design {index + 1}</h3>

                        <button
                          onClick={() => removeConfig(index)}
                          className="text-red-500 text-lg"
                        >
                          ✕
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">
                        Price: ₹
                        {(getBasePrice() + getAdjustment(config)) *
                          (config.quantity || 1)}
                      </p>

                      {product.customizations?.map((field) => (
                        <div key={field.id}>
                          <label
                            className={`block text-sm mb-1 ${
                              !isFieldComplete(config, field)
                                ? "text-red-500"
                                : ""
                            }`}
                          >
                            {field.label}
                            {!isFieldComplete(config, field) && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </label>

                          {/* TEXT */}
                          {field.type === "text" && (
                            <input
                              type="text"
                              value={config[field.label] || ""}
                              className="border p-2 w-full"
                              onChange={(e) =>
                                handleChange(index, field, e.target.value)
                              }
                            />
                          )}

                          {/* TEXTAREA */}
                          {field.type === "textarea" && (
                            <textarea
                              value={config[field.label] || ""}
                              className="border p-2 w-full"
                              onChange={(e) =>
                                handleChange(index, field, e.target.value)
                              }
                            />
                          )}

                          {/* RADIO */}
                          {field.type === "radio" &&
                            field.options?.map((opt) => (
                              <label
                                key={`${field.id}-${opt.label}`}
                                className="block"
                              >
                                <input
                                  type="radio"
                                  name={`${field.id}-${index}`}
                                  checked={config[field.label] === opt.label}
                                  onChange={() =>
                                    handleChange(index, field, opt.label)
                                  }
                                />{" "}
                                {opt.label}
                              </label>
                            ))}

                          {/* CHECKBOX */}
                          {field.type === "checkbox" &&
                            field.options?.map((opt) => (
                              <label
                                key={`${field.id}-${opt.label}`}
                                className="block"
                              >
                                <input
                                  type="checkbox"
                                  checked={(config[field.label] || []).includes(
                                    opt.label,
                                  )}
                                  onChange={(e) => {
                                    const prev = config[field.label] || [];

                                    const updated = e.target.checked
                                      ? [...prev, opt.label]
                                      : prev.filter((o) => o !== opt.label);

                                    handleChange(index, field, updated);
                                  }}
                                />{" "}
                                {opt.label}
                              </label>
                            ))}

                          {/* DROPDOWN */}
                          {field.type === "dropdown" && (
                            <select
                              value={config[field.label] || ""}
                              className="border p-2 w-full"
                              onChange={(e) =>
                                handleChange(index, field, e.target.value)
                              }
                            >
                              <option value="">Select</option>
                              {field.options?.map((opt) => (
                                <option key={opt.label} value={opt.label}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          )}

                          {/* FILE */}
                          {field.type === "file" &&
                            (() => {
                              // find radio selection (Double / Single)
                              const selectedOption = Object.values(config).find(
                                (val) =>
                                  val === "Double Sided" ||
                                  val === "Single Sided",
                              );

                              // SINGLE SIDED
                              if (selectedOption === "Single Sided") {
                                const value = config[field.label];

                                return (
                                  <div className="space-y-2">
                                    <label className="text-sm">Design</label>

                                    {value && (
                                      <img
                                        src={getPreviewSrc(value)}
                                        className="w-16 h-16 object-cover border"
                                      />
                                    )}

                                    <input
                                      type="file"
                                      onChange={(e) =>
                                        handleFileUpload(
                                          index,
                                          field.label,
                                          e.target.files[0],
                                        )
                                      }
                                    />

                                    <p className="text-xs text-gray-500">
                                      {value ? "Change" : "Upload"}
                                    </p>
                                  </div>
                                );
                              }

                              // DOUBLE SIDED
                              if (selectedOption === "Double Sided") {
                                const frontKey = `${field.label}_front`;
                                const backKey = `${field.label}_back`;

                                return (
                                  <div className="space-y-3">
                                    {/* FRONT */}
                                    <div>
                                      <label className="text-sm">
                                        Front Design
                                      </label>

                                      {config[frontKey] && (
                                        <img
                                          src={getPreviewSrc(config[frontKey])}
                                          className="w-16 h-16 object-cover border"
                                        />
                                      )}

                                      <input
                                        type="file"
                                        onChange={(e) =>
                                          handleFileUpload(
                                            index,
                                            `${field.label}_front`,
                                            e.target.files[0],
                                          )
                                        }
                                      />

                                      <p className="text-xs text-gray-500">
                                        {config[frontKey] ? "Change" : "Upload"}
                                      </p>
                                    </div>

                                    {/* BACK */}
                                    <div>
                                      <label className="text-sm">
                                        Back Design
                                      </label>

                                      {config[backKey] && (
                                        <img
                                          src={getPreviewSrc(config[backKey])}
                                          className="w-16 h-16 object-cover border"
                                        />
                                      )}

                                      <input
                                        type="file"
                                        onChange={(e) =>
                                          handleFileUpload(
                                            index,
                                            `${field.label}_back`,
                                            e.target.files[0],
                                          )
                                        }
                                      />

                                      <p className="text-xs text-gray-500">
                                        {config[backKey] ? "Change" : "Upload"}
                                      </p>
                                    </div>
                                  </div>
                                );
                              }

                              // DEFAULT (if nothing selected yet)
                              return (
                                <input
                                  type="file"
                                  onChange={(e) =>
                                    handleFileUpload(
                                      index,
                                      field.label,
                                      e.target.files[0],
                                    )
                                  }
                                />
                              );
                            })()}
                        </div>
                      ))}

                      {/* QUANTITY */}
                      <div>
                        <label className="text-sm">Quantity</label>
                        <input
                          type="number"
                          min="1"
                          value={config.quantity || 1}
                          className="border p-2 w-full"
                          onChange={(e) =>
                            handleChange(index, "quantity", +e.target.value)
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={addConfig} className="mt-3 text-blue-600">
                  + Add Design
                </button>
              </div>

              {hasUnsavedChanges && isAlreadyInCart && (
                <div className="mb-4 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                  You have unsaved changes. Click <strong>Update Cart</strong> to save them, or continue browsing if you want to discard them.
                </div>
              )}

              {/* DESKTOP STICKY BUTTONS */}
              <div className="hidden lg:flex gap-4 pt-4">
                <button
                  onClick={() => {
                    const formattedConfigs = formatConfigs();

                    setConfigs((prev) =>
                      prev.map((c, index) => ({
                        ...c,
                        designId: formattedConfigs[index].designId,
                      })),
                    );

                    console.log("ADDING TO WHOLESALE CART:", {
                      ...product,
                      image: media[0]?.url,
                    });
                    addToWholesaleCart(
                      {
                        ...product,
                        price: getBasePrice(),
                        image: media[0]?.url || "",
                        customizations: product.customizations,
                      },
                      formattedConfigs,
                      appliedOffers,
                    );

                    setSavedCartConfigs(formattedConfigs);
                    setHasUnsavedChanges(false);
                  }}
                  disabled={!canSubmit}
                  className="bg-black text-white px-6 py-3 w-full disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isAlreadyInCart ? "Update Cart" : "Add to Cart"}
                </button>

                <button
                  className="bg-green-500 text-white px-6 py-3 w-full disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={!canSubmit}
                >
                  Buy Now
                </button>
              </div>
              {!canSubmit && (
                <p className="text-sm text-red-600 pt-2">
                  Complete all required customization fields before continuing.
                </p>
              )}
            </div>
          </div>
          {/* PRODUCT SPECIFICATIONS */}
          <div className="mb-20 mt-8 bg-gray-50 border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Product <span className="font-bold">Specifications</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <div>
                  <p className="text-gray-500">Name</p>
                  <p className="font-medium">
                    {product.productName || product.name}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Category</p>
                  <p className="font-medium">
                    {product.category?.name ||
                      getSpecificationValue("Category", "Printing Products")}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Country of Origin</p>
                  <p>{getSpecificationValue("Country of Origin", "India")}</p>
                </div>

                <div>
                  <p className="text-gray-500">Type</p>
                  <p>{getSpecificationValue("Type", "Custom Printed Product")}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-gray-500">Price</p>
                  <p>₹{getBasePrice()}</p>
                </div>

                <div>
                  <p className="text-gray-500">Brand</p>
                  <p>
                    {getSpecificationValue(
                      "Brand",
                      product.more_details?.brand || "Your Brand",
                    )}
                  </p>
                </div>
              </div>
            </div>

            {extraSpecifications.length > 0 && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                {extraSpecifications.map((item, index) => (
                  <div key={`${item.key}-${index}`}>
                    <p className="text-gray-500">{item.key?.trim()}</p>
                    <p>{item.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* MOBILE FIXED BUTTONS */}
      <div className=" lg:hidden fixed bottom-[64px] left-0 right-0 bg-white border-t p-3 z-50">
        <div className="flex gap-3">
          <button
            onClick={() => {
              const formattedConfigs = formatConfigs();

              setConfigs((prev) =>
                prev.map((c, index) => ({
                  ...c,
                  designId: formattedConfigs[index].designId,
                })),
              );

              console.log("ADDING TO WHOLESALE CART:", {
                ...product,
                image: media[0]?.url,
              });
              addToWholesaleCart(
                {
                  ...product,
                  price: getBasePrice(),
                  image: media[0]?.url || "",
                  customizations: product.customizations,
                },
                formattedConfigs,
                appliedOffers,
              );

              setSavedCartConfigs(formattedConfigs);
              setHasUnsavedChanges(false);
            }}
            disabled={!canSubmit}
            className="bg-black text-white py-3 flex-1 rounded-lg min-w-0 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isAlreadyInCart ? "Update Cart" : "Add to Cart"}
          </button>

          <button
            className="bg-green-500 text-white py-3 flex-1 rounded-lg min-w-0 disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={!canSubmit}
          >
            Buy Now
          </button>
        </div>
        {!canSubmit && (
          <p className="text-sm text-red-600 pt-2">
            Complete all required customization fields before continuing.
          </p>
        )}
      </div>
      {showAllOffers && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end lg:items-center justify-center">
          {/* MODAL CONTAINER */}
          <div
            className="
              bg-white w-full 
              max-h-[calc(100vh-80px)] flex flex-col lg:h-auto 
              lg:max-w-3xl 
              rounded-t-2xl lg:rounded-xl 
              p-5 relative 
              overflow-visible
            "
          >
            {/* DRAG HANDLE (mobile premium feel) */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-3 lg:hidden"></div>

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setShowAllOffers(false)}
              className="absolute top-3 right-3 text-lg font-bold"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold mb-4 text-center lg:text-left">
              All Offers
            </h2>

            <div className="overflow-y-auto h-[75vh] lg:h-auto pr-1 pb-8 no-scrollbar flex justify-center lg:block">
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:overflow-x-auto sm:justify-start lg:grid lg:grid-cols-3 no-scrollbar w-full max-w-lg lg:max-w-none px-2 pb-4">
                {activeOffers.map((offer) => {
                  const isApplied = appliedOffers.some(
                    (o) => o._id === offer._id,
                  );

                  return (
                    <div
                      key={offer._id}
                      onClick={() => !isApplied && handleApplyOffer(offer)}
                      className={`
    relative flex-shrink-0 
    w-[170px]
    rounded-2xl
    px-4 py-4
    bg-white/80 backdrop-blur-xl
    border border-gray-100
    shadow-sm
    hover:shadow-md
    transition-all duration-300
    cursor-pointer
    overflow-hidden

    ${isApplied ? "opacity-60 pointer-events-none" : "hover:-translate-y-1"}
  `}
                    >
                      {/* SOFT TOP ACCENT */}
                      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-pink-400 via-violet-500 to-indigo-500"></div>

                      {/* APPLIED BADGE */}
                      {isApplied && (
                        <div className="absolute top-2 right-2 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                          Applied
                        </div>
                      )}

                      {/* OFFER TITLE */}
                      <p className="mt-3 text-sm font-semibold text-gray-800 leading-snug line-clamp-2">
                        {offer.title}
                      </p>

                      {/* DISCOUNT */}
                      {offer.discountPercent > 0 && (
                        <div className="mt-4">
                          <p className="text-2xl font-black text-violet-600 leading-none">
                            {offer.discountPercent}%
                          </p>

                          {offer.expiryDate && (
                            <p className="text-[10px] text-gray-400 mt-1 tracking-wide">
                              Valid till{" "}
                              {new Date(offer.expiryDate).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                },
                              )}
                            </p>
                          )}
                        </div>
                      )}

                      {/* MINI BOTTOM DECOR */}
                      <div className="mt-4 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-400"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-400"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="hidden md:block">
        <BottomBar />
      </div>
    </div>
  );
}
