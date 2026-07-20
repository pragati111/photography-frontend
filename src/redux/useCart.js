import { useDispatch, useSelector } from "react-redux";
import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  updateQuantity as updateQuantityAction,
  clearCart as clearCartAction,
} from "./cartActions";
import axios from "axios";
import { useAuth } from "../components/AuthContext";

export const useCart = () => {
  const { user, token } = useAuth();
  const API = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);

  const getAdjustment = (product, config) => {
    let extra = 0;

    product.customizations?.forEach((field) => {
      const selected = config[field.label];

      if (!selected) return;

      if (Array.isArray(selected)) {
        selected.forEach((val) => {
          const opt = field.options?.find((o) => o.label === val);
          extra += opt?.priceAdjustment || 0;
        });
      } else {
        const opt = field.options?.find((o) => o.label === selected);
        extra += opt?.priceAdjustment || 0;
      }
    });

    return extra;
  };

  return {
    cart: items,
    addToCart: async (product, configs,offers = []) => {
      // 1️⃣ Redux update (instant UI)
      dispatch(addToCartAction(product, configs, offers));

      // 2️⃣ Backend call
      if (!user?.id) return;

      try {
        await axios.post(
          `${API}/api/cart/add`,
          {
            userId: user.id,
            productId: product._id || product.id,
            configs: configs.map((c) => ({
  designId: c.designId,
  quantity: c.quantity || 1,
  config: c.config ? c.config : c,
})),
            offers: offers
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } catch (err) {
        console.error("Backend add to cart failed", err);
      }
    },
    removeFromCart: async (productId, designId) => {
      // 1️⃣ Redux update (instant UI)
      dispatch(removeFromCartAction(productId, designId));

      // 2️⃣ Backend call
      if (!user?.id) return;

      try {
        await axios.post(
          `${API}/api/cart/remove`,
          {
            userId: user.id,
            productId,
            designId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } catch (err) {
        console.error("Backend remove failed", err);
      }
    },
    updateQuantity: async (productId, designId, quantity) => {
      // 1️⃣ Redux update (instant UI)
      dispatch(updateQuantityAction(productId, designId, quantity));

      // 2️⃣ Backend call
      if (!user?.id) return;

      try {
        await axios.put(
          `${API}/api/cart/update`,
          {
            userId: user.id,
            productId,
            designId,
            quantity,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } catch (err) {
        console.error("Backend update failed", err);
      }
    },
    clearCart: () => dispatch(clearCartAction()),
    getTotalQuantity: () =>
      items.reduce(
        (total, product) =>
          total +
          product.designs.reduce((sum, d) => sum + Number(d.quantity || 0), 0),
        0,
      ),
    getTotalPrice: () =>
  items.reduce((total, product) => {
    return (
      total +
      product.designs.reduce((sum, d) => {
        const adjustment = getAdjustment(product, d.config);

        // 🔥 STEP 1: base price
        let price = Number(product.price) + adjustment;

        // 🔥 STEP 2: apply offers (FIXED ✅)
        (d.offers || []).forEach((offer) => {
          if (offer.discountPercent) {
            price = price - (price * offer.discountPercent) / 100;
          }
        });

        // 🔥 STEP 3: multiply by quantity
        return sum + price * Number(d.quantity || 0);
      }, 0)
    );
  }, 0),
  };
};
