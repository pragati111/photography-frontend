import TopHeader from "../components/TopHeader";
import { useAuth } from "../components/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function WholesaleOrders() {
  const { token } = useAuth();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsOrder, setDetailsOrder] = useState(null);
  const [cancelOrder, setCancelOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [complainedOrders, setComplainedOrders] = useState([]);

  const [complaintOrder, setComplaintOrder] = useState(null);
  const [complaintData, setComplaintData] = useState({
    orderId: "",
    title: "",
    description: "",
    category: "Product Quality",
    priority: "Medium",
    complainantName: user?.name || "",
    complainantEmail: user?.email || "",
    complainantPhone: user?.phone || "",
  });

  const openTrackingModal = (order) => {
    setSelectedOrder(order);
  };

  const closeTrackingModal = () => {
    setSelectedOrder(null);
  };

  const getStatusColor = (status) => {
    if (status === "PLACED") return "text-amber-500";
    if (status === "CONFIRMED") return "text-blue-500";
    if (status === "SHIPPED") return "text-indigo-500";
    if (status === "DELIVERED") return "text-green-600";
    if (status === "CANCELLED") return "text-red-500";
    return "text-gray-500";
  };

  const handleSubmitComplaint = async () => {
    try {
      await axios.post(`${API}/api/complaint`, complaintData);

      toast.success("Complaint submitted successfully");
      setComplainedOrders((prev) =>
        prev.includes(complaintData.orderId)
          ? prev
          : [...prev, complaintData.orderId],
      );
      setComplaintOrder(null);
      setComplaintData({
        orderId: "",
        title: "",
        description: "",
        category: "Product Quality",
        priority: "Medium",
        complainantName: user?.name || "",
        complainantEmail: user?.email || "",
        complainantPhone: user?.phone || "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit complaint");
    }
  };

  const handleCancelOrder = async () => {
    try {
      await axios.patch(
        `${API}/api/order/wholesale/${cancelOrder._id}/cancel`,
        {
          reason: cancelReason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setOrders((prev) =>
        prev.map((o) =>
          o._id === cancelOrder._id ? { ...o, status: "CANCELLED" } : o,
        ),
      );

      toast.success("Order cancelled successfully");

      setCancelOrder(null);
      setCancelReason("");
    } catch (err) {
      console.error(err?.response?.data || err);
      toast.error(err?.response?.data?.message || "Failed to cancel order");
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API}/api/order/wholesale/my-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchOrders();
  }, [token]);

  useEffect(() => {
    if (!token) return;

    const fetchComplaints = async () => {
      try {
        const res = await axios.get(`${API}/api/complaint`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const complaints = res.data?.data || [];

        const orderIds = complaints.map((c) => c._id);

        setComplainedOrders(orderIds);
      } catch (err) {
        console.error("Failed to fetch complaints", err);
      }
    };

    fetchComplaints();
  }, [token]);

  return (
    <>
      <TopHeader />

      {!token ? (
        <div className="pt-24 px-4 md:px-10 bg-gray-100 min-h-screen flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Wholesale Orders</h2>
            <p className="text-gray-600 mb-6">Please log in to view and track your wholesale orders.</p>
            <Link to="/auth" className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium">
              Login to Continue
            </Link>
          </div>
        </div>
      ) : (
        <div className="pt-24 px-4 md:px-10 bg-gray-100 min-h-screen">
        <div className="max-w-5xl mx-auto">
          {/* HEADER ROW */}
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-semibold">Wholesale Orders</h1>

            <button
              onClick={() => setComplaintOrder({})}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 
      hover:bg-gray-100 transition"
            >
              Any Complaint?
            </button>
          </div>

          <p className="text-gray-500 text-sm mb-6">
            View and track all your wholesale orders
          </p>

          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p>No orders found</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-xl shadow-md p-4 flex flex-col h-[180px]"
                >
                  {/* TOP SECTION */}
                  <div className="flex items-center justify-between mb-2">
                    {/* LEFT */}
                    <div className="flex flex-col">
                      <p className="text-xs text-blue-600">#{order._id}</p>
                      <p className="text-[11px] text-gray-400">
                        Placed At :{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* RIGHT - STATUS */}
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium border
    ${
      order.status === "PLACED"
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : order.status === "CONFIRMED"
          ? "bg-blue-50 text-blue-700 border-blue-200"
          : order.status === "SHIPPED"
            ? "bg-indigo-50 text-indigo-700 border-indigo-200"
            : order.status === "OUT_FOR_DELIVERY"
              ? "bg-purple-50 text-purple-700 border-purple-200"
              : order.status === "DELIVERED"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
    }`}
                    >
                      <span>
                        {order.status === "PLACED" && "🧾"}
                        {order.status === "CONFIRMED" && "✔"}
                        {order.status === "SHIPPED" && "🚚"}
                        {order.status === "OUT_FOR_DELIVERY" && "📦"}
                        {order.status === "DELIVERED" && "✅"}
                        {order.status === "CANCELLED" && "❌"}
                      </span>

                      <span className="uppercase tracking-wide">
                        {order.status.replaceAll("_", " ")}
                      </span>
                    </div>
                  </div>

                  {/* ITEMS */}
                  <div className="space-y-2 flex-1 overflow-y-auto pr-1 max-h-[110px] scrollbar-thin scrollbar-thumb-gray-300">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 border rounded-md p-2 bg-gray-50 text-sm"
                      >
                        {/* IMAGE */}
                        <img
                          src={
                            item.product?.media?.[0]?.url ||
                            item.product?.images?.[0] ||
                            "/fallback.png"
                          }
                          className="w-10 h-10 object-cover rounded border"
                        />

                        {/* TEXT */}
                        <div className="flex-1">
                          <p className="font-medium text-xs truncate">
                            {item.name}
                          </p>
                          <p className="text-gray-500 text-xs">
                            Qty: {item.quantity}
                          </p>
                        </div>

                        {/* PRICE */}
                        <p className="text-xs font-semibold whitespace-nowrap">
                          ₹{item.sellingPrice ?? 0} each
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* BUTTONS */}
                  <div className="mt-auto pt-3 flex gap-2">
                    {/* VIEW DETAILS */}
                    <button
                      onClick={() => setDetailsOrder(order)}
                      className="flex-1 text-xs py-2 rounded-lg border border-gray-300 text-gray-700 
    hover:bg-gray-100 transition-all duration-200"
                    >
                      View Details
                    </button>

                    {/* ✅ MAIN ACTION BUTTON */}
                    {order.status === "PLACED" ? (
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to cancel this order?",
                            )
                          ) {
                            setCancelOrder(order);
                          }
                        }}
                        className="flex-1 text-xs py-2 rounded-lg bg-red-500 text-white 
    hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        ❌ Cancel
                      </button>
                    ) : order.status === "CANCELLED" ? (
                      <button
                        disabled
                        className="flex-1 text-xs py-2 rounded-lg bg-gray-200 text-gray-400 cursor-not-allowed"
                      >
                        Cancelled
                      </button>
                    ) : order.status === "DELIVERED" ? (
                      <button
                        disabled
                        className="flex-1 text-xs py-2 rounded-lg bg-green-500 text-white 
      cursor-not-allowed shadow-sm"
                      >
                        ✅ Delivered
                      </button>
                    ) : (
                      <button
                        onClick={() => openTrackingModal(order)}
                        className="flex-1 text-xs py-2 rounded-lg bg-black text-white 
      hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        🚚 Track
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      )}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-xl p-6 relative">
            {/* CLOSE BUTTON */}
            <button
              onClick={closeTrackingModal}
              className="absolute top-3 right-3 text-gray-500"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold mb-4">Track Your Order</h2>

            {/* STATUS + STEPPER LOGIC */}
            {selectedOrder.status === "CANCELLED" && (
              <div className="mb-4 text-center text-red-500 font-semibold">
                ❌ Order Cancelled
              </div>
            )}

            {selectedOrder.status !== "CANCELLED" &&
              (() => {
                const steps = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];

                const statusMap = {
                  PLACED: 0,
                  CONFIRMED: 1,
                  SHIPPED: 2,
                  DISPATCHED: 2,
                  DELIVERED: 3,
                };

                const currentIndex = statusMap[selectedOrder.status] ?? 0;

                const latestUpdate =
                  selectedOrder.trackingUpdates?.[
                    selectedOrder.trackingUpdates.length - 1
                  ];

                return (
                  <div className="flex items-center justify-between mb-6 relative">
                    {steps.map((step, i) => {
                      const isActive = i <= currentIndex;

                      return (
                        <div
                          key={step}
                          className="flex-1 flex flex-col items-center relative group"
                        >
                          {/* LINE */}
                          {i !== 0 && (
                            <div
                              className={`absolute left-[-50%] top-3 w-full h-1 transition-all duration-500 ${
                                i <= currentIndex
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            />
                          )}

                          {/* CIRCLE */}
                          <div
                            className={`w-7 h-7 rounded-full z-10 flex items-center justify-center text-xs text-white font-bold transition-all duration-500 ${
                              isActive
                                ? "bg-green-500 scale-110 shadow-lg"
                                : "bg-gray-300"
                            }`}
                          >
                            {isActive ? "✓" : ""}
                          </div>

                          {/* LABEL */}
                          <p className="text-xs mt-2">{step}</p>

                          {/* TOOLTIP (on SHIPPED hover) */}
                          {step === "SHIPPED" && latestUpdate && (
                            <div className="absolute bottom-[-60px] hidden group-hover:block bg-black text-white text-xs px-3 py-2 rounded shadow-lg w-48 text-center">
                              <p>{latestUpdate.status}</p>
                              <p className="text-gray-300 text-[10px] mt-1">
                                {latestUpdate.location}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

            {/* TRACKING HISTORY */}
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {selectedOrder.trackingUpdates?.length > 0 ? (
                selectedOrder.trackingUpdates.map((t, idx) => (
                  <div key={idx} className="border rounded p-3 text-sm">
                    <p className="font-semibold">{t.status}</p>
                    <p className="text-gray-500 text-xs">{t.location}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(t.updatedAt).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  No tracking updates available yet
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      {detailsOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-xl p-6 relative max-h-[80vh] overflow-y-auto">
            {/* CLOSE */}
            <button
              onClick={() => setDetailsOrder(null)}
              className="absolute top-3 right-3 text-gray-500"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold mb-4">Order Details</h2>

            {detailsOrder.items.map((item, idx) => (
              <div
                key={idx}
                className="border rounded-xl p-4 mb-4 shadow-sm bg-gray-50"
              >
                {/* PRODUCT HEADER */}
                <div className="flex gap-3 items-center mb-3">
                  <img
                    src={
                      item.product?.media?.[0]?.url ||
                      item.product?.images?.[0] ||
                      "/fallback.png"
                    }
                    className="w-16 h-16 object-cover rounded-lg border"
                  />

                  <div className="flex-1">
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      ₹{item.sellingPrice ?? 0}
                    </p>
                  </div>
                </div>

                {/* CUSTOMIZATION SECTION */}
                {item.designs?.map((d, i) => (
                  <div key={i} className="mt-3 border-t pt-3 text-xs space-y-2">
                    <p>
                      <span className="text-gray-500">Quantity:</span>{" "}
                      <span className="font-medium">{d.quantity}</span>
                    </p>
                    {d.config && Object.entries(d.config)
                      .filter(([key]) => key !== "quantity")
                      .map(([key, val]) => {
                        if (typeof val === "string" && val.startsWith("http")) {
                          return (
                            <div key={key}>
                              <p className="text-gray-500 mb-1">{key}</p>
                              <img
                                src={val}
                                className="w-20 h-20 object-cover rounded border"
                              />
                            </div>
                          );
                        }

                        if (Array.isArray(val)) {
                          return (
                            <p key={key}>
                              <span className="text-gray-500">{key}:</span>{" "}
                              <span className="font-medium">
                                {val.join(", ")}
                              </span>
                            </p>
                          );
                        }

                        return (
                          <p key={key}>
                            <span className="text-gray-500">{key}:</span>{" "}
                            <span className="font-medium">{String(val)}</span>
                          </p>
                        );
                      })}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
      {complaintOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 relative shadow-xl">
            {/* CLOSE */}
            <button
              onClick={() => setComplaintOrder(null)}
              className="absolute top-3 right-3 text-gray-500"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold mb-4">Raise a Complaint</h2>

            {/* ORDER INFO */}
            {complaintOrder?._id && (
              <div className="text-xs text-gray-500 mb-4">
                Order ID: #{complaintOrder._id}
              </div>
            )}

            {/* FORM */}
            <div className="space-y-3">
              <select
                value={complaintData.orderId}
                onChange={(e) =>
                  setComplaintData({
                    ...complaintData,
                    orderId: e.target.value,
                  })
                }
              >
                <option value="">Select Order</option>
                {orders.map((o) => (
                  <option key={o._id} value={o._id}>
                    {o._id}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Your Name"
                value={complaintData.complainantName}
                onChange={(e) =>
                  setComplaintData({
                    ...complaintData,
                    complainantName: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />

              <input
                type="email"
                placeholder="Your Email"
                value={complaintData.complainantEmail}
                onChange={(e) =>
                  setComplaintData({
                    ...complaintData,
                    complainantEmail: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />

              <input
                type="text"
                placeholder="Your Phone"
                value={complaintData.complainantPhone}
                onChange={(e) =>
                  setComplaintData({
                    ...complaintData,
                    complainantPhone: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />

              <input
                type="text"
                placeholder="Title"
                value={complaintData.title}
                onChange={(e) =>
                  setComplaintData({ ...complaintData, title: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />

              <textarea
                placeholder="Describe your issue..."
                value={complaintData.description}
                onChange={(e) =>
                  setComplaintData({
                    ...complaintData,
                    description: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-3 py-2 text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-black"
              />

              <select
                value={complaintData.category}
                onChange={(e) =>
                  setComplaintData({
                    ...complaintData,
                    category: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option>Product Quality</option>
                <option>Delivery Issue</option>
                <option>Customer Service</option>
                <option>Billing / Payment</option>
                <option>Technical Issue</option>
                <option>Other</option>
              </select>

              <select
                value={complaintData.priority}
                onChange={(e) =>
                  setComplaintData({
                    ...complaintData,
                    priority: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Urgent</option>
              </select>

              <button
                onClick={handleSubmitComplaint}
                className="w-full py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition"
              >
                Submit Complaint
              </button>
            </div>
          </div>
        </div>
      )}
      {cancelOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 relative shadow-xl">
            {/* CLOSE */}
            <button
              onClick={() => setCancelOrder(null)}
              className="absolute top-3 right-3 text-gray-500"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold mb-4">Cancel Order</h2>

            <p className="text-xs text-gray-500 mb-3">
              Order ID: #{cancelOrder._id}
            </p>

            <textarea
              placeholder="Please tell us why you're cancelling..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setCancelOrder(null)}
                className="flex-1 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
              >
                Keep Order
              </button>

              <button
                onClick={handleCancelOrder}
                disabled={!cancelReason.trim()}
                className="flex-1 py-2 rounded-lg bg-red-500 text-white 
          hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
