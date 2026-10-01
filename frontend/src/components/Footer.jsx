import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const linkCls =
  "text-sm text-white/60 hover:text-blue-400 transition-colors duration-200";

const socialCls =
  "w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:border-blue-500/50 hover:shadow-[0_0_12px_rgba(37,99,235,0.45)] hover:scale-110 transition-all duration-200";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const onSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
    setEmail("");
    setTimeout(() => setDone(false), 3000);
  };

  return (
    <footer className="relative overflow-hidden border-t border-blue-500/20 bg-slate-950/90 backdrop-blur-xl text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
          {/* Brand */}
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

          {/* Kampuni & Msaada — NO Vipengele */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">
              Kampuni & Msaada
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#about" className={linkCls}>
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

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">
              Taarifa
            </h4>
            <p className="text-sm text-white/50 mb-3">
              Jiunge upate taarifa za mfumo na masasisho.
            </p>
            <form
              onSubmit={onSubscribe}
              className="flex flex-col sm:flex-row gap-2"
            >
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

        {/* Bottom — NO SW/EN */}
        <div className="relative mt-12 pt-8 border-t border-white/10">
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

            <div className="flex items-center justify-center md:justify-end gap-2">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/signiai/"
                target="_blank"
                rel="noreferrer"
                className={socialCls}
                aria-label="Instagram"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 fill-current"
                  aria-hidden="true"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/adroph2605-del/groundwater-system"
                target="_blank"
                rel="noreferrer"
                className={socialCls}
                aria-label="GitHub"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 fill-current"
                  aria-hidden="true"
                >
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              </a>

              {/* Email */}
              <a
                href="mailto:support@groundwater.tz"
                className={socialCls}
                aria-label="Email"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 fill-none stroke-current"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}