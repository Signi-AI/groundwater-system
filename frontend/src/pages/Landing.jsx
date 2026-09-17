import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";
import ScrollRevealText from "../components/ScrollRevealText";
import StatsBar from "../components/AnimatedCounter";
import GlassFeatureCard from "../components/GlassFeatureCard";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";

const SIDES = [
  "/images/side-1.jpeg",
  "/images/side-2.jpeg",
  "/images/side-3.jpeg",
  "/images/side-4.jpeg",
  "/images/side-5.jpeg",
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

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

  const features = [
    { title: t("landing.feat1Title"), desc: t("landing.feat1Desc") },
    { title: t("landing.feat2Title"), desc: t("landing.feat2Desc") },
    { title: t("landing.feat3Title"), desc: t("landing.feat3Desc") },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Bg + Nav + Hero + Features */}
      <div className="relative overflow-hidden">
        <img
          src="/images/Bg.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/50" />

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

            <nav className="hidden md:flex items-center gap-6 text-sm text-white/90">
              <a href="#features" className="hover:text-white">{t("landing.features")}</a>
              <a href="#how" className="hover:text-white">{t("landing.how")}</a>
              <a href="#faq" className="hover:text-white">{t("landing.faq")}</a>
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={toggle}
                className="text-xs px-2.5 py-1.5 rounded-full border border-white/35 text-white bg-black/25 backdrop-blur-sm"
              >
                {dark ? "Light" : "Dark"}
              </button>
              <button
                onClick={toggleLang}
                className="text-xs px-3 py-1.5 rounded-full border border-white/35 text-white font-semibold bg-black/25 backdrop-blur-sm"
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
            <div className="md:hidden relative z-20 mx-4 mb-3 rounded-xl bg-black/75 backdrop-blur-md border border-white/15 px-4 py-4 space-y-3">
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

      <HeroSection />  

        {/* FEATURES — glass + border ray */}
        <section id="features" className="relative z-10 py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <ScrollRevealText
                as="h2"
                text={String(t("landing.featTitle"))}
                className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight"
              />
              <ScrollRevealText
                as="p"
                text={String(t("landing.featSub"))}
                className="mt-5 text-base sm:text-lg font-medium leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {features.map((f, i) => (
                <GlassFeatureCard
                  key={f.title}
                  title={f.title}
                  desc={f.desc}
                  delay={i * 0.1}
                />
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* HOW */}
      <section id="how" className="py-16 md:py-24 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.h2 {...fadeUp} className="text-2xl sm:text-3xl md:text-4xl font-semibold">
            {t("landing.howTitle")}
          </motion.h2>
          <motion.p {...fadeUp} className="mt-3 text-slate-500 text-sm sm:text-base">
            {t("landing.howSub")}
          </motion.p>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {[1, 2, 3, 4].map((n) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: n * 0.06, duration: 0.5 }}
                className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5"
              >
                <span className="text-2xl font-bold text-[#135AAD]">0{n}</span>
                <h3 className="font-semibold mt-2 mb-1">{t(`landing.step${n}`)}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t(`landing.step${n}Desc`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <motion.h2 {...fadeUp} className="text-2xl sm:text-3xl font-semibold">
              {t("landing.faqTitle")}
            </motion.h2>
            <motion.p {...fadeUp} className="mt-2 text-sm text-slate-500">
              {t("landing.faqSub")}
            </motion.p>
          </div>
          <div className="space-y-3">
            {faqs.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 p-2">
            {SIDES.map((src) => (
              <img
                key={src}
                src={src}
                alt=""
                className="w-full h-full min-h-[140px] object-cover rounded-xl opacity-60"
              />
            ))}
          </div>
          <div className="absolute inset-0 bg-[#050505]/88" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <ScrollRevealText
            as="h2"
            text={String(t("landing.ctaTitle"))}
            className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight"
          />
          <ScrollRevealText
            as="p"
            text={String(t("landing.ctaSub"))}
            className="mt-6 text-base sm:text-lg font-medium leading-relaxed"
          />
          <motion.div {...fadeUp} className="mt-10">
            <Link
              to="/register"
              className="inline-block px-8 py-3.5 rounded-full bg-[#135AAD] hover:bg-[#0f4a8f] text-white font-semibold text-sm shadow-xl"
            >
              {t("landing.cta")}
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}