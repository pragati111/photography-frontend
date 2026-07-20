import TopHeader from "../components/TopHeader";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axios from "axios";
const API = import.meta.env.VITE_API_URL;

export default function AuthPage() {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [wholesalerEmail, setWholesalerEmail] = useState("");
  const [wholesalerPin, setWholesalerPin] = useState("");
  const [isWholesalerLoggingIn, setIsWholesalerLoggingIn] = useState(false);

  useEffect(() => {
    if (!showOtp) return;

    if (secondsRemaining > 0) {
      const interval = window.setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);

      return () => window.clearInterval(interval);
    }

    setCanResend(true);
  }, [showOtp, secondsRemaining]);

  const startOtpTimer = () => {
    setSecondsRemaining(180);
    setCanResend(false);
  };

  const formatTimer = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const canSendOtp = mobile.length === 10 && !isSendingOtp;
  const canLogin = otp.length === 6 && !isLoggingIn;
  const canWholesalerLogin = wholesalerEmail.length >= 4 && wholesalerPin.length >= 4 && !isWholesalerLoggingIn;

  const handleSendOtp = async () => {
    if (mobile.length !== 10 || isSendingOtp) return;

    setIsSendingOtp(true);
    try {
      const payload = {
        phoneNumber: `+91${mobile}`,
      };

      await axios.post(
        `${API}/api/auth/send-otp`,
        payload,
      );

      setShowOtp(true);
      setOtp("");
      startOtpTimer();
    } catch (err) {
      console.error(err);
      alert("Failed to send OTP");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || isResending) return;
    setIsResending(true);

    try {
      await axios.post(
        `${API}/api/auth/send-otp`,
        { phoneNumber: `+91${mobile}` },
      );
      startOtpTimer();
      setOtp("");
      alert("OTP resent");
    } catch (err) {
      console.error(err);
      alert("Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();
  const fromPath = location.state?.from || "/";
  const redirectPath = fromPath === "/auth" ? "/" : fromPath;

  // If user is already logged in and lands on this page, redirect to the original page or home
  useEffect(() => {
    if (user) {
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate, redirectPath]);

  const handleWholesalerLogin = async () => {
    if (!canWholesalerLogin) {
      if (wholesalerEmail.length < 4 || wholesalerPin.length < 4) {
        alert("Please enter your email and PIN to continue.");
      }
      return;
    }

    setIsWholesalerLoggingIn(true);
    try {
      const res = await axios.post(
        `${API}/api/wholesalers/login`,
        {
          email: wholesalerEmail,
          pin: wholesalerPin,
        },
      );

      // store token
      localStorage.setItem("wholesalerToken", res.data.token);

      // store wholesaler
      localStorage.setItem("wholesaler", JSON.stringify(res.data.wholesaler));

      // update auth context
      login({
        user: res.data.wholesaler,
        token: res.data.token,
        role: "wholesaler",
      });

      navigate(redirectPath, { replace: true });
    } catch (err) {
      console.error(err);
      alert("Invalid phone number or PIN");
    } finally {
      setIsWholesalerLoggingIn(false);
    }
  };

  const handleLogin = async () => {
    if (otp.length !== 6 || isLoggingIn) {
      if (otp.length !== 6) alert("Enter valid 6-digit OTP");
      return;
    }

    setIsLoggingIn(true);
    try {
      const payload = {
        phoneNumber: `+91${mobile}`,
        otp: otp,
      };

      const res = await axios.post(
        `${API}/api/auth/verify-otp`,
        payload,
      );

      if (res.data && res.data.token) {
        // ✅ store token
        localStorage.setItem("token", res.data.token);

        // ✅ update your auth context
        login({
          user: res.data.user,
          token: res.data.token,
          role: "customer",
        });

        // ✅ redirect
        navigate(redirectPath, { replace: true });
      } else {
        alert("Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      alert("OTP verification failed");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <>
      <TopHeader />

      <div className="pt-[90px] md:pt-[110px] min-h-screen bg-gray-100 px-4">
        {!selectedRole && !user && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl">
              <h2 className="text-2xl font-semibold text-center text-gray-800">
                Welcome
              </h2>

              <p className="text-sm text-gray-500 text-center mt-2">
                Please select how you want to continue
              </p>

              <div className="mt-8 space-y-4">
                <button
                  onClick={() => setSelectedRole("customer")}
                  className="w-full py-4 rounded-2xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                >
                  Continue as Customer
                </button>

                <button
                  onClick={() => setSelectedRole("wholesaler")}
                  className="w-full py-4 rounded-2xl border border-gray-300 font-medium hover:bg-gray-100 transition"
                >
                  Continue as Wholesaler
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Login Box */}
        {selectedRole === "customer" && (
          <div className="flex justify-center py-12">
            <div className="w-full max-w-md bg-white/95 border border-slate-200 shadow-[0_40px_80px_-40px_rgba(15,23,42,0.35)] rounded-[36px] p-8 backdrop-blur-sm">
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-semibold text-slate-900">
                  {showOtp ? "Customer Login" : "Login / Register"}
                </h2>
                <p className="mt-3 text-sm text-slate-500 leading-6">
                  Enter your mobile number and verify with OTP. The code is valid for 3 minutes.
                </p>
              </div>

              <div className="mt-8 space-y-5">
                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-3 flex flex-wrap items-center gap-3 rounded-[28px] border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm">
                    <span className="text-sm text-slate-600">+91</span>
                    <input
                      type="text"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                      placeholder="Enter your mobile number"
                      className="flex-1 min-w-0 bg-transparent outline-none text-sm text-slate-900"
                    />

                    {showOtp && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowOtp(false);
                          setOtp("");
                          setSecondsRemaining(0);
                          setCanResend(false);
                        }}
                        className="flex-none rounded-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition"
                      >
                        Change
                      </button>
                    )}
                  </div>
                </div>

                {showOtp && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-slate-700">
                        OTP <span className="text-red-500">*</span>
                      </label>
                      <span className="text-sm text-slate-500">
                        {secondsRemaining > 0
                          ? `Expires in ${formatTimer(secondsRemaining)}`
                          : "OTP expired"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 rounded-[28px] border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm">
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        placeholder="Enter OTP"
                        className="flex-1 bg-transparent outline-none text-sm text-slate-900"
                      />

                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={!canResend || isResending}
                        className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition ${
                          canResend
                            ? "border-blue-500 bg-blue-50 text-blue-600 hover:bg-blue-100"
                            : "border-slate-200 bg-slate-100 text-slate-300 cursor-not-allowed"
                        }`}
                        aria-label="Resend OTP"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-5 w-5"
                        >
                          <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6a5.99 5.99 0 0 1-4.5 5.78l1.06 1.06A7.98 7.98 0 0 0 20 12c0-4.42-3.58-8-8-8zm-6.78 2.22L3.16 5.28A7.98 7.98 0 0 0 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3c-3.31 0-6-2.69-6-6 0-.78.15-1.52.42-2.2z" />
                        </svg>
                      </button>
                    </div>

                    <p className="text-xs text-slate-500">
                      Resend becomes active after 3 minutes. Please use the latest OTP sent to your phone.
                    </p>

                  </div>
                )}

                <button
                  type="button"
                  onClick={showOtp ? handleLogin : handleSendOtp}
                  disabled={showOtp ? !canLogin : !canSendOtp}
                  className={`w-full rounded-[28px] py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/10 transition ${
                    showOtp ? "bg-gradient-to-r from-slate-900 to-blue-700" : "bg-gradient-to-r from-slate-900 to-blue-700"
                  } ${showOtp ? "hover:brightness-110" : "hover:brightness-110"} ${
                    (showOtp ? !canLogin : !canSendOtp) ? "opacity-70 cursor-not-allowed" : "hover:brightness-110"
                  }`}
                >
                  {showOtp ? (
                    isLoggingIn ? (
                      <span className="inline-flex items-center justify-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Logging in...
                      </span>
                    ) : (
                      "Login"
                    )
                  ) : isSendingOtp ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Sending OTP...
                    </span>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
        {selectedRole === "wholesaler" && (
          <div className="flex justify-center pt-2 md:pt-12">
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-xl">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Wholesaler Login
                </h2>

                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  To receive your wholesaler PIN, contact us on
                </p>

                <p className="text-lg font-semibold text-blue-600 mt-1">
                  +91 9456676569
                </p>
              </div>

              <div className="mt-8">
                <label className="text-sm font-medium text-gray-700">
                  Email Address
                </label>

                <input
                  type="email"
                  value={wholesalerEmail}
                  onChange={(e) => setWholesalerEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full mt-2 border rounded-xl px-4 py-3 outline-none"
                />
              </div>

              <div className="mt-5">
                <label className="text-sm font-medium text-gray-700">PIN</label>

                <input
                  type="password"
                  value={wholesalerPin}
                  onChange={(e) => setWholesalerPin(e.target.value)}
                  placeholder="Enter PIN"
                  className="w-full mt-2 border rounded-xl px-4 py-3 outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleWholesalerLogin}
                disabled={!canWholesalerLogin}
                className={`w-full mt-8 py-3 rounded-xl text-white transition ${
                  canWholesalerLogin
                    ? "bg-black hover:opacity-90"
                    : "bg-slate-300 cursor-not-allowed text-slate-500"
                }`}
              >
                {isWholesalerLoggingIn ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Logging in...
                  </span>
                ) : (
                  "Login as Wholesaler"
                )}
              </button>

              <button
                onClick={() => setSelectedRole(null)}
                className="w-full mt-4 text-sm text-gray-500 hover:text-black"
              >
                ← Back
              </button>
            </div>
          </div>
        )}

        {/* Accordions Section (UNCHANGED) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div>
            <h3 className="text-center mb-3 font-medium">
              We've Got You Covered
            </h3>
            <div className="border rounded-lg divide-y bg-white">
              <div className="p-3">Free Shipping</div>
              <div className="p-3">100% Satisfaction Guarantee</div>
            </div>
          </div>

          <div>
            <h3 className="text-center mb-3 font-medium">
              We're The Best in Everything
            </h3>
            <div className="border rounded-lg divide-y bg-white">
              <div className="p-3">Best Price</div>
              <div className="p-3">Best Print Quality</div>
              <div className="p-3">Best Customer Service</div>
              <div className="p-3">Best Material</div>
            </div>
          </div>

          <div>
            <h3 className="text-center mb-3 font-medium">Our Milestones</h3>
            <div className="border rounded-lg divide-y bg-white pb-20">
              <div className="p-3">58 Lakh+ Products Delivered</div>
              <div className="p-3">57321+ Google Reviews</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
