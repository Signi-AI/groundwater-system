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

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await api.register({
        email: form.email,
        full_name: form.full_name || form.email.split("@")[0],
        password: form.password,
      });
      const loginData = await api.login(form.email, form.password);
      setToken(loginData.access_token);
      navigate("/app/predict");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] min-h-screen relative flex items-center justify-center px-4 py-6 sm:py-10 overflow-x-hidden">
      <img src="/images/Bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
      <div className="absolute inset-0 bg-slate-950/45" />

      <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-5 md:gap-10 lg:gap-14">
        <AuthMascot mode="register" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[420px] sm:max-w-md rounded-2xl backdrop-blur-xl bg-slate-900/75 border border-white/10 shadow-2xl p-5 sm:p-8"
        >
          <div className="relative flex p-1 rounded-full bg-white/5 border border-white/10 mb-6 sm:mb-8">
            <Link
              to="/login"
              className="relative z-10 flex-1 text-center text-xs sm:text-sm font-medium py-2.5 sm:py-3 text-gray-400 hover:text-white transition"
            >
              {t("auth.signIn") || "Ingia"}
            </Link>
            <Link
              to="/register"
              className="relative z-10 flex-1 text-center text-xs sm:text-sm font-semibold py-2.5 sm:py-3 text-white"
            >
              {t("auth.createAccount") || "Fungua Akaunti"}
            </Link>
            <motion.div
              layoutId="authTab"
              className="absolute top-1 bottom-1 right-1 w-[calc(50%-4px)] rounded-full bg-blue-600 shadow-lg shadow-blue-500/30"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          </div>

          <h1 className="text-white text-lg sm:text-xl font-semibold mb-1">
            {t("auth.createAccount") || "Fungua Akaunti"}
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mb-5 sm:mb-6">
            Create your account to start predicting
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
              <label className="block text-xs text-gray-400 mb-1.5">{t("auth.fullName") || "Full name"}</label>
              <input name="full_name" autoComplete="name" value={form.full_name} onChange={onChange} placeholder="Your name" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">{t("auth.email") || "Email"}</label>
              <input type="email" name="email" inputMode="email" autoComplete="email" value={form.email} onChange={onChange} required placeholder="name@email.com" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">{t("auth.password") || "Password"}</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} name="password" autoComplete="new-password" value={form.password} onChange={onChange} required minLength={6} placeholder="••••••••" className={inputCls + " pr-12"} />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-2 top-1/2 -translate-y-1/2 min-w-[40px] min-h-[40px] flex items-center justify-center text-gray-400 hover:text-white">
                  {showPw ? "🙈" : "👁"}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">{t("auth.confirmPassword") || "Confirm password"}</label>
              <div className="relative">
                <input type={showConfirm ? "text" : "password"} name="confirm" autoComplete="new-password" value={form.confirm} onChange={onChange} required placeholder="••••••••" className={inputCls + " pr-12"} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-2 top-1/2 -translate-y-1/2 min-w-[40px] min-h-[40px] flex items-center justify-center text-gray-400 hover:text-white">
                  {showConfirm ? "🙈" : "👁"}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className={primaryBtn}>
              {loading ? "..." : (t("auth.createAccount") || "FUNGUA AKAUNTI").toUpperCase()}
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