import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { api, setToken } from "../services/api";
import AuthMascot from "../components/AuthMascot";

const inputCls =
  "w-full min-h-[44px] bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg px-3 py-3 text-sm sm:text-base outline-none transition";

const primaryBtn =
  "w-full min-h-[48px] bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-lg py-3 text-sm sm:text-base shadow-lg shadow-blue-500/25 transition-all disabled:opacity-60";

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
    <div className="min-h-[100dvh] min-h-screen relative flex items-center justify-center px-4 py-6 sm:py-10 overflow-x-hidden">
      <img src="/images/Bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
      <div className="absolute inset-0 bg-slate-950/45" />

      <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row items-center md:items-center justify-center gap-5 md:gap-10 lg:gap-14">
        <AuthMascot mode="login" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[420px] sm:max-w-md rounded-2xl backdrop-blur-xl bg-slate-900/75 border border-white/10 shadow-2xl p-5 sm:p-8"
        >
          <div className="relative flex p-1 rounded-full bg-white/5 border border-white/10 mb-6 sm:mb-8">
            <Link
              to="/login"
              className="relative z-10 flex-1 text-center text-xs sm:text-sm font-semibold py-2.5 sm:py-3 text-white"
            >
              {t("auth.signIn") || "Ingia"}
            </Link>
            <Link
              to="/register"
              className="relative z-10 flex-1 text-center text-xs sm:text-sm font-medium py-2.5 sm:py-3 text-gray-400 hover:text-white transition"
            >
              {t("auth.createAccount") || "Fungua Akaunti"}
            </Link>
            <motion.div
              layoutId="authTab"
              className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full bg-blue-600 shadow-lg shadow-blue-500/30"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          </div>

          <h1 className="text-white text-lg sm:text-xl font-semibold mb-1">
            {t("auth.signIn") || "Ingia"}
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mb-5 sm:mb-6">
            Welcome back to Groundwater System
          </p>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 text-xs sm:text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">{t("auth.email") || "Email"}</label>
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@email.com"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">{t("auth.password") || "Password"}</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className={inputCls + " pr-12"}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 min-w-[40px] min-h-[40px] flex items-center justify-center text-gray-400 hover:text-white"
                >
                  {showPw ? "🙈" : "👁"}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs sm:text-sm text-blue-400 hover:text-blue-300 py-1">
                {t("auth.forgotLink") || "Forgot password?"}
              </Link>
            </div>
            <button type="submit" disabled={loading} className={primaryBtn}>
              {loading ? "..." : (t("auth.signIn") || "INGIA").toUpperCase()}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-500">
            <Link to="/" className="hover:text-gray-300 inline-block py-2">← Home</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}