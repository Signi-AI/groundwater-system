import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api, setToken } from "../services/api";

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

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12 overflow-hidden">
      <img
        src="/images/Bg.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/55" />

      <div
        className="relative z-10 w-full max-w-md rounded-[2rem] rounded-tl-[4rem] border border-white/15 shadow-2xl p-8 sm:p-10"
        style={glassCard}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-white text-sm font-semibold tracking-[0.25em] uppercase">
            Register
          </h1>
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
              <span>👤</span> {t("auth.fullName")}
            </label>
            <input
              name="full_name"
              value={form.full_name}
              onChange={onChange}
              placeholder="Your name"
              className="w-full bg-transparent text-white text-sm outline-none placeholder:text-white/30 py-1"
            />
          </div>

          <div className="border-b border-white/25 pb-2">
            <label className="flex items-center gap-2 text-white/50 text-xs mb-1">
              <span>✉️</span> {t("auth.email")}
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
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
              name="password"
              value={form.password}
              onChange={onChange}
              required
              minLength={6}
              placeholder="Password"
              className="w-full bg-transparent text-white text-sm outline-none placeholder:text-white/30 py-1"
            />
          </div>

          <div className="border-b border-white/25 pb-2">
            <label className="flex items-center gap-2 text-white/50 text-xs mb-1">
              <span>🔒</span> {t("auth.confirmPassword")}
            </label>
            <input
              type="password"
              name="confirm"
              value={form.confirm}
              onChange={onChange}
              required
              placeholder="Confirm password"
              className="w-full bg-transparent text-white text-sm outline-none placeholder:text-white/30 py-1"
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <Link to="/login" className="text-white/60 hover:text-white">
              {t("auth.haveAccount")} {t("auth.signIn")}
            </Link>
            <Link
              to="/forgot-password"
              className="text-white/70 hover:text-white hover:underline underline-offset-2"
            >
              {t("auth.forgotLink")}
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-white text-sm font-semibold tracking-widest uppercase disabled:opacity-60"
            style={glassBtn}
          >
            {loading ? t("common.loading") : t("auth.createAccount")}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-white/40">
          <Link to="/" className="hover:text-white/70">
            ← Home
          </Link>
        </p>
      </div>
    </div>
  );
}