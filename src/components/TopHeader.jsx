import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useState, useEffect, useRef } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../redux/useCart";
import { useWholesaleCart } from "../redux/useWholesaleCart";
import SearchComponent from "./SearchComponent";

export default function TopHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, logout } = useAuth();
  const { getTotalQuantity: getCustomerTotalQuantity } = useCart();
  const { getTotalQuantity: getWholesaleTotalQuantity } = useWholesaleCart();

  // Choose the correct quantity based on role
  const getTotalQuantity = () =>
    role === "wholesaler"
      ? getWholesaleTotalQuantity()
      : getCustomerTotalQuantity();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const isAuthPage = location.pathname === "/auth";

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="fixed top-0 w-full h-16 md:h-20 bg-white border-b z-50 flex items-center px-4 md:px-8">

      <div className="flex items-center w-full">

        {/* 🔹 LEFT (LOGO) */}
        <div
          onClick={() => navigate("/")}
          className="flex-shrink-0 cursor-pointer font-bold text-lg"
        >
          LOGO
        </div>

        {/* 🔹 CENTER (DESKTOP SEARCH) */}
        {!isAuthPage && (
          <div className="hidden md:flex flex-1 justify-center px-4">
            <SearchComponent />
          </div>
        )}

        {/* 🔹 RIGHT */}
        {!isAuthPage && (
          <div className="flex items-center gap-4 ml-auto">

            {/* 🔍 MOBILE SEARCH */}
            <div className="md:hidden">
              <SearchComponent isMobileTrigger />
            </div>

            {/* 🛒 CART */}
            <div
              onClick={() => navigate("/cart")}
              className="relative cursor-pointer hover:scale-110 transition"
            >
              <ShoppingCart size={22} />

              {getTotalQuantity() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                  {getTotalQuantity()}
                </span>
              )}
            </div>

            {/* 👤 USER */}
            {!user ? (
              <button
                onClick={() =>
                  navigate("/auth", {
                    state: { from: location.pathname + location.search },
                  })
                }
                className="border px-3 py-1 rounded-full text-xs md:text-sm"
              >
                Login / Register
              </button>
            ) : (
              <div ref={dropdownRef} className="relative">
                <div
                  onClick={() => setOpen(!open)}
                  className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center cursor-pointer"
                >
                  {user?.phoneNumber?.slice(-2) || "U"}
                </div>

                {open && (
                  <div className="absolute right-0 mt-2 bg-white border rounded-xl shadow-lg w-40 overflow-hidden">
                    <div
                      onClick={() => {
                        navigate("/account");
                        setOpen(false);
                      }}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      My Account
                    </div>

                    <div
                      onClick={() => {
                        logout();
                        navigate("/");
                      }}
                      className="p-2 hover:bg-gray-100 cursor-pointer text-red-500"
                    >
                      Logout
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}