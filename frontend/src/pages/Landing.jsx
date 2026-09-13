import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";

const SIDES = [
  "/images/side-1.jpeg",
  "/images/side-2.jpeg",
  "/images/side-3.jpeg",
  "/images/side-4.jpeg",
  "/images/side-5.jpeg",
];

export default function Landing() {
  const { dark, toggle } = useTheme();
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const isSw = i18n.language && i18n.language.startsWith("sw");
  const toggleLang = () => i18n.changeLanguage(isSw ? "en" : "sw");

  const faqs = [1, 2, 3, 4, 5].map((n) => ({
    q: t(`landing.faq${n}q`),
    a: t(`landing.faq${n}a`),
  }));

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* ===== Bg.jpg: NAV + HERO + FEATURES (no floats) ===== */}
      <div className="relative overflow-hidden">
        <img
          src="/images/Bg.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40" />

        {/* NAV */}
        <header className="relative z-20">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#135AAD] text-white text-sm font-bold flex items-center justify-center shadow">
                GP
              </div>
              <span className="font-semibold text-sm hidden sm:block text-white drop-shadow">
                {t("landing.brand")}
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-6 text-sm text-white/95">
              <a href="#features" className="hover:text-[#F48936] drop-shadow">
                {t("landing.features")}
              </a>
              <a href="#how" className="hover:text-[#F48936] drop-shadow">
                {t("landing.how")}
              </a>
              <a href="#faq" className="hover:text-[#F48936] drop-shadow">
                {t("landing.faq")}
              </a>
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={toggle}
                className="text-xs px-2.5 py-1.5 rounded-full border border-white/40 text-white bg-black/20 backdrop-blur-sm"
              >
                {dark ? "Light" : "Dark"}
              </button>
              <button
                onClick={toggleLang}
                className="text-xs px-3 py-1.5 rounded-full border border-white/40 text-white font-semibold bg-black/20 backdrop-blur-sm"
              >
                {isSw ? "SW → EN" : "EN → SW"}
              </button>
              <Link
                to="/register"
                className="hidden sm:inline-flex text-sm px-4 py-2 rounded-lg bg-[#135AAD] text-white font-medium hover:bg-[#0f4a8f] shadow"
              >
                {t("landing.cta")}
              </Link>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 rounded-lg border border-white/40 text-white"
              >
                {menuOpen ? "×" : "☰"}
              </button>
            </div>
          </div>

          {menuOpen && (
            <div className="md:hidden relative z-20 mx-4 mb-3 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 px-4 py-4 space-y-3">
              <a href="#features" onClick={() => setMenuOpen(false)} className="block text-sm py-2 text-white">
                {t("landing.features")}
              </a>
              <a href="#how" onClick={() => setMenuOpen(false)} className="block text-sm py-2 text-white">
                {t("landing.how")}
              </a>
              <a href="#faq" onClick={() => setMenuOpen(false)} className="block text-sm py-2 text-white">
                {t("landing.faq")}
              </a>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block text-center text-sm px-4 py-2.5 rounded-lg bg-[#135AAD] text-white"
              >
                {t("landing.cta")}
              </Link>
            </div>
          )}
        </header>

        {/* HERO */}
        <section className="relative z-10 flex items-center py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-4 w-full">
            <div className="max-w-xl">
              <span className="inline-flex text-xs bg-black/35 text-white px-3 py-1 rounded-full mb-4 border border-white/25">
                {t("landing.badge")}
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white drop-shadow-lg">
                {t("landing.title1")}
                <br />
                <span className="text-white">{t("landing.title2")}</span>
              </h1>
              <p className="mt-4 text-white text-sm sm:text-base max-w-md drop-shadow">
                {t("landing.subtitle")}
              </p>
              <div className="mt-8">
                <Link
                  to="/register"
                  className="inline-block px-7 py-3 rounded-xl bg-[#135AAD] hover:bg-[#0f4a8f] text-white font-semibold text-sm shadow-xl"
                >
                  {t("landing.cta")}
                </Link>
              </div>
              <div className="mt-12 flex gap-10 text-white drop-shadow">
                <div>
                  <p className="text-2xl sm:text-3xl font-bold">1,240+</p>
                  <p className="text-white/85 text-xs">{t("landing.stat1")}</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold">89%</p>
                  <p className="text-white/85 text-xs">{t("landing.stat2")}</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold">26</p>
                  <p className="text-white/85 text-xs">{t("landing.stat3")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES — same Bg, NO float pictures, readable cards */}
        <section id="features" className="relative z-10 py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow">
              {t("landing.featTitle")}
            </h2>
            <p className="mt-2 text-white text-sm max-w-xl mx-auto font-medium drop-shadow">
              {t("landing.featSub")}
            </p>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-5 text-left">
              {[
                { title: t("landing.feat1Title"), desc: t("landing.feat1Desc") },
                { title: t("landing.feat2Title"), desc: t("landing.feat2Desc") },
                { title: t("landing.feat3Title"), desc: t("landing.feat3Desc") },
              ].map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl p-6 bg-white shadow-lg border border-slate-100"
                >
                  <h3 className="font-bold mb-2 text-slate-900">{f.title}</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* HOW */}
      <section id="how" className="py-16 md:py-20 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold">{t("landing.howTitle")}</h2>
          <p className="mt-2 text-slate-500 text-sm">{t("landing.howSub")}</p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5"
              >
                <span className="text-2xl font-bold text-[#135AAD]">0{n}</span>
                <h3 className="font-semibold mt-2 mb-1">{t(`landing.step${n}`)}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t(`landing.step${n}Desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 md:py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold">{t("landing.faqTitle")}</h2>
            <p className="mt-2 text-sm text-slate-500">{t("landing.faqSub")}</p>
          </div>
          <div className="space-y-3">
            {faqs.map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left px-4 py-3.5 flex justify-between items-center gap-3 text-sm font-medium"
                >
                  <span>{item.q}</span>
                  <span className="text-[#135AAD]">{openFaq === idx ? "−" : "+"}</span>
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-sm text-slate-600 dark:text-slate-400">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + SIDES — restored as before */}
      <section className="relative py-20 md:py-28 overflow-hidden text-white">
        <div className="absolute inset-0">
          <div className="absolute inset-0 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 p-2">
            {SIDES.map((src, i) => (
              <img
                key={src}
                src={src}
                alt=""
                className="w-full h-full min-h-[140px] object-cover rounded-xl opacity-70 animate-orbit"
                style={{ animationDelay: `${i * 0.6}s` }}
              />
            ))}
          </div>
          <div className="absolute inset-0 bg-[#0b3d75]/72" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-4xl font-bold drop-shadow-lg">
            {t("landing.ctaTitle")}
          </h2>
          <p className="mt-3 text-blue-100 text-sm sm:text-base">
            {t("landing.ctaSub")}
          </p>
          <Link
            to="/register"
            className="inline-block mt-8 px-8 py-3.5 rounded-xl bg-[#135AAD] hover:bg-[#0f4a8f] font-semibold text-sm shadow-xl"
          >
            {t("landing.cta")}
          </Link>
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-400 py-8 text-center text-xs">
        <p>{t("landing.footer")}</p>
      </footer>
    </div>
  );
}