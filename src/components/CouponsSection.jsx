import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import {

  TicketPercent,
  Copy,
  Calendar,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL;

export default function CouponsSection() {
  const { user, token, role } = useAuth();

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCoupon, setCopiedCoupon] = useState(null);

  useEffect(() => {
    if (role !== "wholesaler") {
      setLoading(false);
      return;
    }

    fetchCoupons();
  }, [role, user, token]);

  const fetchCoupons = async () => {
    try {
      if (!user?._id || !token) return;

      const res = await fetch(
        `${API}/api/wholesale-coupon/wholesaler/${user._id}/active`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (data.success) {
        setCoupons(data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch coupons:", err);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);

      setCopiedCoupon(code);

      setTimeout(() => {
        setCopiedCoupon(null);
      }, 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  if (role !== "wholesaler") return null;

  if (loading) {
    return (
      <div className="px-4 md:px-8 lg:px-12 py-6">
        <div className="h-56 rounded-3xl bg-gray-200 animate-pulse" />
      </div>
    );
  }

  if (!coupons.length) {
    return (
      <section className="px-4 md:px-8 lg:px-12 py-8">
        <div className="rounded-[32px] border border-violet-100 bg-gradient-to-r from-violet-50 via-pink-50 to-fuchsia-50 p-8 text-center">
          <Sparkles size={42} className="mx-auto text-violet-500 mb-4" />

          <h2 className="text-2xl font-bold text-gray-900">
            Coupons Available For You
          </h2>

          <p className="mt-3 text-gray-500">
            No active coupons available right now.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 md:px-8 lg:px-12 py-8">
      <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 p-[1px] shadow-2xl">
        <div className="rounded-[36px] bg-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-50 via-pink-50 to-fuchsia-50" />

          <div className="relative p-6 md:p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center text-white">
                <TicketPercent size={26} />
              </div>

              <div>
                <h2 className="text-lg sm:text-xl md:text-3xl font-bold text-gray-900">
                  Coupons Available For You 🎉
                </h2>

                <p className="text-xs sm:text-sm text-gray-500">
                  Exclusive wholesale offers unlocked for your account
                </p>
              </div>
            </div>

            <div className="flex gap-3 sm:gap-5 overflow-x-auto pb-2 snap-x snap-mandatory">
              {coupons.map((coupon) => (
                <div
                  key={coupon._id}
                  className="
                    relative
                    snap-start
                    w-[220px]
                    sm:w-[250px]
                    md:w-[260px]
                    flex-shrink-0
                    overflow-hidden
                    rounded-2xl
                    bg-gradient-to-br
                    from-slate-950
                    via-slate-900
                    to-slate-800
                    text-white
                    shadow-xl
                    transition-all
                    duration-300
                    hover:-translate-y-1
                  "
                >
                  {/* coupon holes */}

                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 w-8 h-8 rounded-full bg-white" />

                  <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 w-8 h-8 rounded-full bg-white" />

                  <div
                    className="
                    absolute
                    inset-0
                    opacity-20
                    pointer-events-none
                    bg-[radial-gradient(circle_at_top_right,white,transparent_30%)]
                "
                  />

                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold tracking-wide">
                        ACTIVE
                      </span>

                      <CheckCircle2 size={16} className="text-emerald-400" />
                    </div>

                    {/* Discount */}
                    <div className="mt-3 flex items-end gap-1">
                      <span className="text-3xl font-black leading-none">
                        {coupon.discountValue}
                        {coupon.discountType === "PERCENTAGE" ? "%" : "₹"}
                      </span>

                      <span className="text-xs text-slate-300 mb-1">OFF</span>
                    </div>

                    {/* Coupon Code */}
                    <div className="mt-4 rounded-2xl bg-white/5 border border-white/10 p-2.5">
                      <div className="text-[10px] uppercase tracking-wider text-slate-400">
                        Coupon Code
                      </div>

                      <div className="mt-1 flex items-center justify-between gap-2">
                        <span className="font-bold tracking-wider text-xs sm:text-sm break-all">
                          {coupon.couponCode}
                        </span>

                        <div className="flex items-center gap-2">
                          {copiedCoupon === coupon.couponCode && (
                            <span className="text-[10px] text-green-400 font-medium">
                              Copied!
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              copyCode(coupon.couponCode);
                            }}
                            className="
                            p-1.5
                            rounded-lg
                            bg-white/10
                            hover:bg-white/20
                            transition
                            cursor-pointer
                            "
                          >
                            <Copy size={13} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between text-[10px] sm:text-[11px] text-slate-300">
                      <span>Min ₹{coupon.minOrderAmount}</span>

                      <div className="flex items-center gap-1">
                        <Calendar size={11} />
                        <span>
                          {new Date(coupon.expiryDate).toLocaleDateString(
                            "en-IN",
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
