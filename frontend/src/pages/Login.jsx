import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { api, setToken } from "../services/api";

const inputCls =
  "w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg p-3 text-sm outline-none transition";

const primaryBtn =
  "w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg py-3 shadow-lg shadow-blue-500/25 transition-all disabled:opacity-60";

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.login(email, password);
      setToken(data.access_token);
      navigate("/app");
    } catch (err) {
      setError(err.message || "Login failed");
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
        transition={{ duration: 0.45 }}
        className="relative z-10 w-full max-w-md rounded-2xl backdrop-blur-xl bg-slate-900/70 border border-white/10 shadow-2xl p-6 sm:p-8"
      >
        {/* Tabs */}
        <div className="relative flex p-1 rounded-full bg-white/5 border border-white/10 mb-8">
          <Link
            to="/login"
            className="relative z-10 flex-1 text-center text-sm font-semibold py-2.5 text-white"
          >
            {t("auth.signIn") || "Ingia"}
          </Link>
          <Link
            to="/register"
            className="relative z-10 flex-1 text-center text-sm font-medium py-2.5 text-gray-400 hover:text-white transition"
          >
            {t("auth.createAccount") || "Fungua Akaunti"}
          </Link>
          <motion.div
            layoutId="authTab"
            className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full bg-blue-600 shadow-lg shadow-blue-500/30"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        </div>

        <h1 className="text-white text-xl font-semibold mb-1">
          {t("auth.signIn") || "Ingia"}
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          Welcome back to Groundwater System
        </p>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">
              {t("auth.email") || "Email"}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@email.com"
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5">
              {t("auth.password") || "Password"}
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className={inputCls + " pr-11"}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-sm"
                aria-label="Toggle password"
              >
                {showPw ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-xs text-blue-400 hover:text-blue-300 transition"
            >
              {t("auth.forgotLink") || "Forgot password?"}
            </Link>
          </div>

          <button type="submit" disabled={loading} className={primaryBtn}>
            {loading ? "..." : t("auth.signIn") || "INGIA"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500">
          <Link to="/" className="hover:text-gray-300 transition">
            ← Home
          </Link>
        </p>
      </motion.div>
    </div>
  );
}