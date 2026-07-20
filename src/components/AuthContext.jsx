import { createContext, useContext, useState, useEffect } from "react";
import { store } from "../redux/store";
import axios from "axios";
import { clearCart, setCart } from "../redux/cartActions";
import { clearWholesaleCart, setWholesaleCart } from "../redux/wholesaleCartActions";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API = import.meta.env.VITE_API_URL;

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const storedToken = localStorage.getItem("token") || localStorage.getItem("wholesalerToken");
    const user = JSON.parse(localStorage.getItem("user"));
    const role = localStorage.getItem("role");
    return { user, token: storedToken, role };
  });

  useEffect(() => {
    const loadCart = async () => {
      if (!auth.user || !auth.token) return;

      const userId = auth.user.id || auth.user._id;
      if (!userId) return;

      store.dispatch(clearCart());
      store.dispatch(clearWholesaleCart());

      try {
        const res = await axios.get(`${API}/api/cart?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });

        const backendItems = res.data.items || [];
        const formatted = backendItems.map((item) => ({
          productId: item.productId.toString(),
          name: item.name,
          price: item.price,
          image: item.image || item.designs?.[0]?.config?.__productImage || "",
          customizations: item.customizations || [],
          designs: (item.designs || []).map((d) => ({
            designId: d.designId.toString(),
            config: d.config || {},
            quantity: d.quantity || 1,
            offers: d.offers || [],
          })),
        }));

        if (auth.role === "wholesaler") {
          store.dispatch(setWholesaleCart(formatted));
        } else {
          store.dispatch(setCart(formatted));
        }
      } catch (err) {
        console.error("Failed to preload cart on auth change", err);
      }
    };

    loadCart();
  }, [auth.user, auth.role, auth.token]);

  // ✅ login with real backend data
  const login = ({ user, token, role = "customer" }) => {
    setAuth({ user, token, role });

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("role", role);
  };

  const logout = () => {
    setAuth({ user: null, token: null, role: null });

    // Clear both customer and wholesale carts
    store.dispatch(clearCart());
    store.dispatch(clearWholesaleCart());

    localStorage.removeItem("token");
    localStorage.removeItem("wholesalerToken");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}