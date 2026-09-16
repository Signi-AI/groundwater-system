import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const linkCls =
  "text-sm text-white/60 hover:text-blue-400 transition-colors duration-200";

const socialCls =
  "w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:border-blue-500/50 hover:shadow-[0_0_12px_rgba(37,99,235,0.45)] hover:scale-110 transition-all duration-200";

export default function Footer() {
  const { i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const isSw = i18n.language && i18n.language.startsWith("sw");
  const setLang = (lng) => i18n.changeLanguage(lng);

  const onSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
    setEmail("");
    setTimeout(() => setDone(false), 3000);
  };

  return (
    <footer className="relative overflow-hidden border-t border-blue-500/20 bg-slate-950/90 backdrop-blur-xl text-white">
      {/* subtle top glow line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Col 1 — Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-blue-500/30">
                GP
              </div>
              <div>
                <p className="text-sm font-semibold text-white leading-tight">
                  Mfumo wa Kubashiri
                </p>
                <p className="text-xs text-white/50">Maji Ardhini</p>
              </div>
            </div>
            <p className="text-sm text-white/55 leading-relaxed max-w-xs">
              Tathmini ya maji ardhini kabla ya kuchimba — haraka, wazi, na
              inayolenga mikoa ya Tanzania.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500 shadow-[0_0_8px_rgba(37,99,235,0.9)]" />
              </span>
              <span className="text-xs text-white/80 font-medium">
                ● Mfumo Uko Hewani
              </span>
            </div>
          </div>

          {/* Col 2 — Features */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">
              Vipengele
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#features" className={linkCls}>
                  Uchambuzi
                </a>
              </li>
              <li>
                <a href="#how" className={linkCls}>
                  Mikoa
                </a>
              </li>
              <li>
                <a href="#features" className={linkCls}>
                  Usahihi wa Data
                </a>
              </li>
              <li>
                <a href="#faq" className={linkCls}>
                  Ripoti
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3 — Company */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">
              Kampuni & Msaada
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#how" className={linkCls}>
                  Kuhusu Sisi
                </a>
              </li>
              <li>
                <a href="#faq" className={linkCls}>
                  Maswali
                </a>
              </li>
              <li>
                <a href="mailto:support@groundwater.tz" className={linkCls}>
                  Mawasiliano
                </a>
              </li>
              <li>
                <Link to="/login" className={linkCls}>
                  Msaada
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 — Newsletter */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">
              Taarifa
            </h4>
            <p className="text-sm text-white/50 mb-3">
              Jiunge upate taarifa za mfumo na masasisho.
            </p>
            <form onSubmit={onSubscribe} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Barua pepe"
                className="flex-1 min-h-[44px] rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/35 text-sm px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
              />
              <button
                type="submit"
                className="min-h-[44px] px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all whitespace-nowrap"
              >
                Jiunge
              </button>
            </form>
            {done && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-xs text-blue-400"
              >
                Asante — umejiunga.
              </motion.p>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="relative mt-12 pt-8 border-t border-white/10">
          {/* Watermark */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-6 flex justify-center overflow-hidden select-none"
          >
            <span className="text-white/5 font-black tracking-widest uppercase text-5xl sm:text-6xl md:text-8xl lg:text-9xl whitespace-nowrap">
              UBASHIRI WA MAJI
            </span>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-[11px] sm:text-xs text-white/40 text-center md:text-left max-w-md">
              © 2026 Mfumo wa Kubashiri Maji Ardhini. Haki zote zimehifadhiwa.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-end gap-4">
              {/* Language */}
              <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
                <button
                  type="button"
                  onClick={() => setLang("sw")}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold transition ${
                    isSw
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  SW
                </button>
                <button
                  type="button"
                  onClick={() => setLang("en")}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold transition ${
                    !isSw
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  EN
                </button>
              </div>

              {/* Social */}
              <div className="flex items-center gap-2">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className={socialCls}
                  aria-label="X"
                >
                  𝕏
                </a>
                <a
                  href="https://github.com/adroph2605-del/groundwater-system"
                  target="_blank"
                  rel="noreferrer"
                  className={socialCls}
                  aria-label="GitHub"
                >
                  GH
                </a>
                <a
                  href="mailto:support@groundwater.tz"
                  className={socialCls}
                  aria-label="Email"
                >
                  ✉
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}