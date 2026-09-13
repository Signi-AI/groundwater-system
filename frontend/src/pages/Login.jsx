import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

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

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Email and password required");
      return;
    }
    setLoading(true);
    // DEMO only — no backend
    setTimeout(() => {
      localStorage.setItem("token", "demo-token");
      localStorage.setItem("demo_user", email);
      setLoading(false);
      navigate("/app");
    }, 500);
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
          <h1 className="text-white text-sm font-semibold tracking-[0.25em] uppercase">Login</h1>
          <div className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center text-white/80 text-lg">
            👤
          </div>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-300 bg-red-500/10 border border-red-400/20 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
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

          <div className="border-b border-white/25 pb-2">
            <label className="flex items-center gap-2 text-white/50 text-xs mb-1">
              <span>🔒</span> {t("auth.password")}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="w-full bg-transparent text-white text-sm outline-none placeholder:text-white/30 py-1"
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <Link to="/register" className="text-white/60 hover:text-white">
              {t("auth.noAccount")}
            </Link>
            <Link to="/forgot-password" className="text-white/70 hover:text-white hover:underline">
              {t("auth.forgotLink")}
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-white text-sm font-semibold tracking-widest uppercase disabled:opacity-60"
            style={glassBtn}
          >
            {loading ? t("common.loading") : t("auth.signIn")}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-white/40">
          <Link to="/" className="hover:text-white/70">← Home</Link>
        </p>
      </div>
    </div>
  );
}