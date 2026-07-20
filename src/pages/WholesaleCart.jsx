import TopHeader from "../components/TopHeader";
import { useWholesaleCart } from "../redux/useWholesaleCart";
import { X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setWholesaleCart } from "../redux/wholesaleCartActions";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function WholesaleCart() {
  const { cart, getTotalPrice, removeFromWholesaleCart, updateWholesaleQuantity } = useWholesaleCart();
  const [paymentMethod, setPaymentMethod] = useState("ONLINE");
  const [loading, setLoading] = useState(false);
  const [loadingCart, setLoadingCart] = useState(true);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [productImages, setProductImages] = useState({});
  const { user, token } = useAuth();
  const dispatch = useDispatch();
  const [addresses, setAddresses] = useState([]);
  const navigate = useNavigate();

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

  const selected =
    addresses.length > 0
      ? addresses.find((addr) => addr.isDefault) || addresses[0]
      : null;
  const createOrder = async () => {
    try {
      const items = cart.map((product) => ({
        product: product.productId,

        designs: product.designs.map((d) => ({
          designId: d.designId,
          config: d.config,
          quantity: d.quantity,
          // ADD THIS
          offers: d.offers || [],
        })),
      }));

      const address = addresses.find((addr) => addr.isDefault) || addresses[0];
      console.log("WHOLESALE ORDER PAYLOAD:", items);
      const res = await axios.post(
        `${API}/api/order/wholesale/create`,
        {
          items,
          // ADD THIS
          totalAmount: getTotalPrice(),
          shippingAddress: {
            name: "Wholesaler",
            phone: address?.phone,
            line1: address?.street,
            city: address?.city,
            state: address?.state,
            pincode: address?.pincode,
          },
          paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return res.data;
    } catch (err) {
      console.error(err);
    }
  };
  const createRazorpayOrder = async (orderId) => {
    const res = await axios.post(
      `${API}/api/payment/wholesale/create-order`,
      { orderId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data;
  };

  const verifyPayment = async (response, orderId) => {
    try {
      await axios.post(
        `${API}/api/order/wholesale/verify-payment`,
        {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          orderId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("✅ Wholesale Order Payment Successful");
      navigate("/wholesale-orders");
    } catch (err) {
      console.error(err);
      alert("❌ Payment Failed");
    }
  };

  const openRazorpay = (data, orderId) => {
    const options = {
      key: data.key,
      amount: data.amount,
      currency: data.currency,
      name: "Your Brand - Wholesale",
      description: "Wholesale Order Payment",
      order_id: data.razorpayOrderId,

      handler: function (response) {
        verifyPayment(response, orderId);
      },

      modal: {
      ondismiss: async function () {
        console.log("🔥 Razorpay dismissed");
        try {
          const deleteRes = await axios.post(
  `${API}/api/order/wholesale/delete-payment-order`,
 { orderId },
 {
   headers: {
     Authorization: `Bearer ${token}`,
   },
 },
);

console.log("DELETE RESPONSE:", deleteRes.data);

        } catch (err) {
          console.log("DELETE ERROR:", err.response?.data);
          console.error("Delete failed", err);
        }
      },
    },

      prefill: {
        name: "Wholesaler",
      },

      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  useEffect(() => {
    const fetchCart = async () => {
      setLoadingCart(true);
      console.log("fetchWholesaleCart called, user:", user, "token:", token);
      if (!user?._id) {
        console.log("No user._id, returning");
        setLoadingCart(false);
        return;
      }

      try {
        const res = await axios.get(`${API}/api/cart?userId=${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Backend Wholesale Cart response:", res.data);

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

        console.log("Formatted wholesale items:", formatted);
        dispatch(setWholesaleCart(formatted));
        console.log("Dispatched setWholesaleCart");
      } catch (err) {
        console.error("Failed to fetch wholesale cart", err);
      } finally {
        setLoadingCart(false);
      }
    };

    fetchCart();
  }, [user?._id, token]);

  useEffect(() => {
    const fetchImages = async () => {
      const map = {};

      for (const product of cart) {
        try {
          const res = await axios.get(
            `${API}/api/product/${product.productId}`,
          );
          const data = res.data?.product;

          map[product.productId] =
            data?.media?.[0]?.url || data?.image || data?.images?.[0] || "";
        } catch (err) {
          console.error("Image fetch failed", err);
        }
      }

      setProductImages(map);
    };

    if (cart.length > 0) fetchImages();
  }, [cart]);

  useEffect(() => {
    const fetchAddresses = async () => {
      setLoadingAddresses(true);
      try {
        const res = await axios.get(`${API}/api/wholesalers/address`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const formatted = (res.data.addresses || []).map((addr) => ({
          _id: addr._id,
          label: addr.label || addr.fullName || "Address",
          type: addr.label || addr.fullName || "Wholesale",
          street: [addr.addressLine1, addr.addressLine2].filter(Boolean).join(", "),
          city: addr.city || "",
          state: addr.state || "",
          pincode: addr.pincode || "",
          phone: addr.phone || addr.phoneNumber || "",
          landmark: addr.landmark || "",
          isDefault: addr.isDefault,
        }));

        setAddresses(formatted);
      } catch (err) {
        console.error("Failed to fetch addresses", err);
      } finally {
        setLoadingAddresses(false);
      }
    };

    if (token) fetchAddresses();
    else setLoadingAddresses(false);
  }, [token]);
  const uniqueOffers = [];
  const isCheckoutDisabled =
  loading ||
  cart.length === 0 ||
  !selected;

  {
    cart.forEach((product) => {
      product.designs.forEach((d) => {
        (d.offers || []).forEach((offer) => {
          if (!uniqueOffers.find((o) => o._id === offer._id)) {
            uniqueOffers.push(offer);
          }
        });
      });
    });
  }
  return (
    <>
      <TopHeader />

      <div className="pt-24 px-4 md:px-10 bg-gray-100 h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
          {/* LEFT SIDE - CART ITEMS */}
          <div className="flex-1 bg-white p-6 rounded shadow">
            <h1 className="text-xl font-semibold mb-4">
              Your Wholesale Cart (
              {cart.reduce((sum, product) => sum + product.designs.length, 0)}{" "}
              items)
            </h1>

            {/* HEADER */}
            <div className="hidden md:grid grid-cols-5 text-gray-500 text-sm border-b pb-2 mb-4">
              <span>Item</span>
              <span>Details</span>
              <span>Quantity</span>
              <span>Price</span>
              <span>Total</span>
            </div>

            {loadingCart ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="grid grid-cols-1 md:grid-cols-5 items-center gap-4 border-b py-4"
                  >
                    <div className="w-20 h-20 bg-gray-200 rounded animate-pulse" />

                    <div className="text-sm space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
                        <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 justify-center">
                      <div className="h-8 w-10 bg-gray-200 rounded animate-pulse" />
                    </div>

                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />

                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-gray-200 rounded w-12 animate-pulse" />
                      <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </>
            ) : (
              cart.map((product) =>
                product.designs.map((d) => (
                  <div
                    key={d.designId}
                    className="grid grid-cols-1 md:grid-cols-5 items-center gap-4 border-b py-4"
                  >
                    {/* IMAGE */}
                    <div className="w-20 h-20 relative flex items-center justify-center border rounded overflow-hidden">
                      {!productImages[product.productId] && !product.image && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-xs text-gray-500">
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin mb-1"></div>
                          Loading...
                        </div>
                      )}

                      <img
                        src={
                          productImages[product.productId] ||
                          product.image ||
                          "/fallback.png"
                        }
                        className="w-full h-full object-contain"
                        onLoad={(e) => {
                          e.target.style.opacity = "1";
                        }}
                        style={{ opacity: 0, transition: "opacity 0.3s ease" }}
                      />
                    </div>
                    {/* DETAILS */}
                    <div className="text-sm">
                      <p className="font-semibold">{product.name}</p>

                      {Object.entries(d.config).map(
                        ([key, val]) =>
                          key !== "quantity" &&
                          !key.includes("Design") &&
                          !(typeof val === "string" && val.startsWith("http")) && (
                            <p key={key} className="text-gray-500 text-xs">
                              {key}: {String(val)}
                            </p>
                          ),
                      )}

                      {Object.entries(d.config).some(
                        ([_, val]) =>
                          typeof val === "string" && val.startsWith("http"),
                      ) && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-gray-700">
                            Uploaded Designs:
                          </p>

                          <div className="flex gap-2 mt-1 overflow-x-auto">
                            {Object.entries(d.config).map(([key, val]) =>
                              typeof val === "string" &&
                              val.startsWith("http") ? (
                                <div
                                  key={key}
                                  className="flex-shrink-0 w-12 h-12 border rounded overflow-hidden"
                                >
                                  <img
                                    src={val}
                                    alt="design"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : null,
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    {/* QUANTITY CONTROL */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateWholesaleQuantity(product.productId, d.designId, d.quantity - 1)
                        }
                        disabled={d.quantity <= 1}
                        className="border px-2 disabled:opacity-50"
                      >
                        -
                      </button>

                      <span>{d.quantity}</span>

                      <button
                        onClick={() =>
                          updateWholesaleQuantity(product.productId, d.designId, d.quantity + 1)
                        }
                        className="border px-2"
                      >
                        +
                      </button>
                    </div>
                    {/* PRICE */}
                    <span>
                      ₹{product.price + getAdjustment(product, d.config)}
                    </span>
                    {/* TOTAL + REMOVE */}
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">
                        ₹
                        {(product.price + getAdjustment(product, d.config)) *
                          d.quantity}
                      </span>

                      <button
                        onClick={() => removeFromWholesaleCart(product.productId, d.designId)}
                        className="text-red-500"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                )),
              )
            )}
          </div>

          {/* RIGHT SIDE - SUMMARY */}

          {uniqueOffers.length > 0 && (
            <div className="mb-4 bg-green-50 p-4 rounded">
              <p className="font-semibold text-sm mb-2">Applied Offers</p>

              {uniqueOffers.map((offer) => (
                <div key={offer._id} className="text-xs text-green-700">
                  {offer.title} ({offer.code} - {offer.discountPercent}% off)
                </div>
              ))}
            </div>
          )}

          <div className="w-full lg:w-[300px] bg-white p-6 rounded shadow h-fit">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            {loadingAddresses ? (
              <div className="mb-4 bg-gray-50 p-4 rounded-sm animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            ) : addresses.length > 0 ? (
              <div className="mb-4 bg-gray-50 p-4 rounded-sm">
                <p className="text-sm font-semibold mb-2">Deliver To</p>
                <p className="text-sm font-medium">
                  {addresses.find((addr) => addr.isDefault)?.label ||
                    addresses[0]?.type ||
                    "Address"}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  {selected
                    ? `${selected.street}, ${selected.city}, ${selected.state} - ${selected.pincode}`
                    : "No address"}
                </p>
                <button
                  onClick={() => navigate("/manage-address")}
                  className="mt-3 text-blue-600 text-sm underline"
                >
                  Change address
                </button>
              </div>
            ) : (
              <div className="mb-4 bg-gray-50 p-4 rounded-sm text-sm">
                <button
                  type="button"
                  onClick={() => navigate("/manage-address")}
                  className="text-blue-600 font-medium underline decoration-1 underline-offset-2 hover:text-blue-800"
                >
                  No saved address found. Add one in Manage Address to see it
                  here.
                </button>
              </div>
            )}
            <div className="flex justify-between text-sm mb-2">
              <span>Items (Wholesale Price)</span>
              <span>₹{getTotalPrice()}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="border-t my-3"></div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹{getTotalPrice()}</span>
            </div>

            <div className="mb-4">
              <p className="text-sm font-semibold mb-2">Payment Method</p>

              <label className="block text-sm">
                <input
                  type="radio"
                  value="ONLINE"
                  checked={paymentMethod === "ONLINE"}
                  onChange={() => setPaymentMethod("ONLINE")}
                />{" "}
                Pay Online (UPI)
              </label>

              {/*<label className="block text-sm mt-1">
                <input
                  type="radio"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />{" "}
                Cash on Delivery
              </label>*/}
            </div>
            <button
              disabled={isCheckoutDisabled}
              onClick={async () => {
                setLoading(true);

                try {
                  const orderRes = await createOrder();

                  if (!orderRes?.order) return;

                  const orderId = orderRes.order._id;

                  if (paymentMethod === "COD") {
                    alert("✅ Wholesale Order placed successfully (COD)");
                    navigate("/wholesale-orders");
                    return;
                  }

                  const paymentRes = await createRazorpayOrder(orderId);
                  openRazorpay(paymentRes, orderId);
                } catch (err) {
                  console.error(err);
                } finally {
                  setLoading(false);
                }
              }}
              className="
    mt-4
    w-full
    py-3
    rounded
    text-white
    font-medium
    transition

    disabled:bg-gray-300
    disabled:cursor-not-allowed
    disabled:text-gray-500

    enabled:bg-orange-500
    enabled:hover:bg-orange-600
  "
>
  {loading
    ? "Processing..."
    : cart.length === 0
      ? "Cart is empty"
      : !selected
      ? "Add delivery address"
      : "Checkout"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
