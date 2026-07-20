import { Link, useLocation } from "react-router-dom";
import { Home, Package, ClipboardList } from "lucide-react";
import { useAuth } from "../components/AuthContext";

export default function MobileBottomNav() {
  const location = useLocation();
  const { role } = useAuth();

  const isActive = (path) => location.pathname === path;
  const ordersPath = role === "wholesaler" ? "/wholesale-orders" : "/orders";
  const isOrdersActive = location.pathname === ordersPath;

  const baseStyle =
    "flex flex-col items-center justify-center text-[10px] transition-all duration-200";

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 flex justify-around py-2 md:hidden z-50">
      
      {/* HOME */}
      <Link to="/" className={baseStyle}>
        <Home
          size={18}
          className={`mb-[2px] transition-all ${
            isActive("/") ? "text-[#1e3a8a]" : "text-gray-600"
          }`}
          fill={isActive("/") ? "currentColor" : "none"}
        />
        <span className={isActive("/") ? "text-[#1e3a8a]" : "text-gray-600"}>
          Home
        </span>
      </Link>

      {/* CATEGORIES */}
      <Link to="/categories" className={baseStyle}>
        <Package
          size={18}
          className={`mb-[2px] transition-all ${
            isActive("/categories") ? "text-[#1e3a8a]" : "text-gray-600"
          }`}
          fill={isActive("/categories") ? "currentColor" : "none"}
        />
        <span className={isActive("/categories") ? "text-[#1e3a8a]" : "text-gray-600"}>
          Products
        </span>
      </Link>

      {/* ORDERS */}
      <Link to={ordersPath} className={baseStyle}>
        <ClipboardList
          size={18}
          className={`mb-[2px] transition-all ${
            isOrdersActive ? "text-[#1e3a8a]" : "text-gray-600"
          }`}
          fill={isOrdersActive ? "currentColor" : "none"}
        />
        <span className={isOrdersActive ? "text-[#1e3a8a]" : "text-gray-600"}>
          My Orders
        </span>
      </Link>
    </div>
  );
}