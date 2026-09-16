import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../services/api";

const inputCls =
  "w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg p-3 text-sm outline-none transition";

const primaryBtn =
  "w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg py-3 shadow-lg shadow-blue-500/25 transition-all disabled:opacity-60";

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const data = await api.sendOtp(email);
      setMessage(data.message || "OTP sent if email is registered");
      setStep(2);
    } catch (err) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const doReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!/^\d{6}$/.test(otp.trim())) {
      setError("OTP must be 6 digits");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const data = await api.resetPassword(email, otp.trim(), newPassword);
      setMessage(data.message || "Password updated");
      setStep(3);
    } catch (err) {
      setError(err.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12 overflow-hidden">
      <img src="/images/Bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-slate-950/60" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md rounded-2xl backdrop-blur-xl bg-slate-900/70 border border-white/10 shadow-2xl p-6 sm:p-8"
      >
        <h1 className="text-white text-xl font-semibold mb-1">
          {step === 3 ? "Done" : step === 2 ? "Reset password" : "Forgot password"}
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          {step === 1 && "Enter email to receive a 6-digit OTP"}
          {step === 2 && "Enter OTP and your new password"}
          {step === 3 && "You can sign in with your new password"}
        </p>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
            >
              {error}
            </motion.div>
          )}
          {message && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 text-sm text-blue-200 bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2"
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        {step === 1 && (
          <form onSubmit={sendOtp} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@email.com"
                className={inputCls}
              />
            </div>
            <button type="submit" disabled={loading} className={primaryBtn}>
              {loading ? "..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={doReset} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">OTP (6 digits)</label>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength={6}
                placeholder="123456"
                className={inputCls + " tracking-widest"}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">New password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className={inputCls + " pr-11"}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-sm"
                >
                  {showPw ? "🙈" : "👁"}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className={primaryBtn}>
              {loading ? "..." : "Update password"}
            </button>
          </form>
        )}

        {step === 3 && (
          <Link to="/login" className={primaryBtn + " block text-center"}>
            {t("auth.signIn") || "INGIA"}
          </Link>
        )}

        <p className="mt-6 text-center text-xs text-gray-500 space-x-2">
          <Link to="/login" className="hover:text-gray-300">
            Back to login
          </Link>
          <span>·</span>
          <Link to="/" className="hover:text-gray-300">
            Home
          </Link>
        </p>
      </motion.div>
    </div>
  );
}