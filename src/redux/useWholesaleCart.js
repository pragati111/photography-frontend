import { useDispatch, useSelector } from "react-redux";
import {
  addToWholesaleCart as addToWholesaleCartAction,
  removeFromWholesaleCart as removeFromWholesaleCartAction,
  updateWholesaleQuantity as updateWholesaleQuantityAction,
  clearWholesaleCart as clearWholesaleCartAction,
} from "./wholesaleCartActions";
import axios from "axios";
import { useAuth } from "../components/AuthContext";

export const useWholesaleCart = () => {
  const { user, token } = useAuth();
  const API = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const items = useSelector((state) => state.wholesaleCart.items);

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
    addToWholesaleCart: async (product, configs, offers = []) => {
      // 1️⃣ Redux update (instant UI)
      dispatch(addToWholesaleCartAction(product, configs, offers));

      // 2️⃣ Backend call
      if (!user?._id) return;

      try {
        await axios.post(
          `${API}/api/cart/add`,
          {
            userId: user._id,
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
        console.error("Backend add to wholesale cart failed", err);
      }
    },
    removeFromWholesaleCart: async (productId, designId) => {
      // 1️⃣ Redux update (instant UI)
      dispatch(removeFromWholesaleCartAction(productId, designId));

      // 2️⃣ Backend call
      if (!user?._id) return;

      try {
        await axios.post(
          `${API}/api/cart/remove`,
          {
            userId: user._id,
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
    updateWholesaleQuantity: async (productId, designId, quantity) => {
      // 1️⃣ Redux update (instant UI)
      dispatch(updateWholesaleQuantityAction(productId, designId, quantity));

      // 2️⃣ Backend call
      if (!user?._id) return;

      try {
        await axios.put(
          `${API}/api/cart/update`,
          {
            userId: user._id,
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
    clearWholesaleCart: () => dispatch(clearWholesaleCartAction()),
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

            // 🔥 STEP 1: wholesale price
            let price = Number(product.wholesalePrice || product.price) + adjustment;

            // 🔥 STEP 2: apply offers
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
