import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../services/api";

const glassCard = {
  background: "rgba(20, 24, 32, 0.55)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
};

const glassBtn = {
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.2)",
  boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
};

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
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
      <div className="absolute inset-0 bg-black/55" />

      <div
        className="relative z-10 w-full max-w-md rounded-[2rem] rounded-tl-[4rem] border border-white/15 shadow-2xl p-8 sm:p-10"
        style={glassCard}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-white text-sm font-semibold tracking-[0.25em] uppercase">
            {step === 3 ? "Done" : step === 2 ? "Reset" : "Forgot"}
          </h1>
          <div className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center text-white/80 text-lg">
            🔒
          </div>
        </div>

        <p className="text-white/60 text-xs mb-6">
          {step === 1 && "Enter your email to receive a 6-digit OTP"}
          {step === 2 && "Enter OTP from email and your new password"}
          {step === 3 && "You can sign in with your new password"}
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-300 bg-red-500/10 border border-red-400/20 rounded-lg px-3 py-2">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-4 text-sm text-green-300 bg-green-500/10 border border-green-400/20 rounded-lg px-3 py-2">
            {message}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={sendOtp} className="space-y-6">
            <div className="border-b border-white/25 pb-2">
              <label className="flex items-center gap-2 text-white/50 text-xs mb-1">
                <span>✉️</span> {t("auth.email")}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email ID"
                className="w-full bg-transparent text-white text-sm outline-none placeholder:text-white/30 py-1"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-white text-sm font-semibold tracking-widest uppercase disabled:opacity-60"
              style={glassBtn}
            >
              {loading ? t("common.loading") : "Send OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={doReset} className="space-y-6">
            <div className="border-b border-white/25 pb-2">
              <label className="flex items-center gap-2 text-white/50 text-xs mb-1">
                <span>🔑</span> OTP (6 digits)
              </label>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength={6}
                placeholder="123456"
                className="w-full bg-transparent text-white text-sm outline-none placeholder:text-white/30 py-1 tracking-widest"
              />
            </div>
            <div className="border-b border-white/25 pb-2">
              <label className="flex items-center gap-2 text-white/50 text-xs mb-1">
                <span>🔒</span> New password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                placeholder="New password"
                className="w-full bg-transparent text-white text-sm outline-none placeholder:text-white/30 py-1"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-white text-sm font-semibold tracking-widest uppercase disabled:opacity-60"
              style={glassBtn}
            >
              {loading ? t("common.loading") : "Update password"}
            </button>
          </form>
        )}

        {step === 3 && (
          <Link
            to="/login"
            className="block w-full text-center py-3.5 rounded-xl text-white text-sm font-semibold tracking-widest uppercase"
            style={glassBtn}
          >
            {t("auth.signIn")}
          </Link>
        )}

        <p className="mt-6 text-center text-xs text-white/50">
          <Link to="/login" className="hover:text-white">
            Back to login
          </Link>
          {" · "}
          <Link to="/" className="hover:text-white">
            Home
          </Link>
        </p>
      </div>
    </div>
  );
}