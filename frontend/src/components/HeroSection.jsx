import React, { useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
} from "framer-motion";

function Counter({ from = 0, to, duration = 2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) =>
    Math.round(latest).toLocaleString()
  );

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, to, { duration, ease: "easeOut" });
    return controls.stop;
  }, [inView, to, duration, count]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>
    </span>
  );
}

function CardItem({ card }) {
  const base =
    "backdrop-blur-md bg-slate-950/40 border border-white/10 hover:border-white/20 p-5 rounded-2xl shadow-lg transition-all duration-300 group text-white";

  if (card.type === "stat") {
    return (
      <div className={base}>
        <p className="text-xs text-white/70 uppercase tracking-wide">{card.title}</p>
        <p className="mt-1 text-2xl font-extrabold text-blue-400">{card.value}</p>
        {card.hint && <p className="mt-1 text-xs text-white/55">{card.hint}</p>}
      </div>
    );
  }

  if (card.type === "image") {
    return (
      <div className="backdrop-blur-md bg-slate-950/40 border border-white/10 hover:border-white/20 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 group">
        <div className="relative">
          <img
            src={card.src}
            alt={card.title}
            className="h-28 sm:h-32 md:h-36 w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="p-3 sm:p-4">
          <p className="text-sm font-bold text-white">{card.title}</p>
          <p className="text-xs text-white/60 mt-0.5">{card.caption}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={base}>
      <p className="text-sm font-bold text-white">{card.title}</p>
      <p className="mt-2 text-xs text-white/65 leading-relaxed">{card.body}</p>
    </div>
  );
}

function ScrollColumn({ cards, direction = "up", duration = 25 }) {
  const loop = [...cards, ...cards];
  const yAnim = direction === "up" ? { y: [0, -1000] } : { y: [-1000, 0] };

  return (
    <div className="flex-1 min-w-0 relative">
      <motion.div
        className="flex flex-col gap-3 sm:gap-4 will-change-transform"
        animate={yAnim}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        {loop.map((card, i) => (
          <CardItem key={`${card.title}-${i}`} card={card} />
        ))}
      </motion.div>
    </div>
  );
}

const scrollMaskStyle = {
  maskImage:
    "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
  WebkitMaskImage:
    "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
};

export default function HeroSection() {
  const { t } = useTranslation();

  const cardsA = useMemo(
    () => [
      {
        type: "stat",
        title: t("landing.cardDepth"),
        value: "45m",
        hint: t("landing.cardExpected"),
      },
      {
        type: "text",
        title: t("landing.feat1Title"),
        body: t("landing.feat1Desc"),
      },
      {
        type: "stat",
        title: t("landing.cardAccuracy"),
        value: "92%",
        hint: t("landing.cardConfidence"),
      },
      {
        type: "image",
        title: t("landing.cardSiteDodoma"),
        src: "/images/side-1.jpeg",
        caption: t("landing.cardPreview"),
      },
      {
        type: "text",
        title: t("landing.feat3Title"),
        body: t("landing.feat3Desc"),
      },
      {
        type: "stat",
        title: t("landing.cardPotential"),
        value: "HIGH",
        hint: t("landing.cardWaterPotential"),
      },
    ],
    [t]
  );

  const cardsB = useMemo(
    () => [
      {
        type: "text",
        title: t("landing.feat2Title"),
        body: t("landing.feat2Desc"),
      },
      {
        type: "stat",
        title: t("landing.stat3"),
        value: "26",
        hint: t("landing.cardCoverage"),
      },
      {
        type: "image",
        title: t("landing.cardSiteArusha"),
        src: "/images/side-2.jpeg",
        caption: t("landing.cardPreview"),
      },
      {
        type: "stat",
        title: "pH",
        value: "7.2",
        hint: t("landing.cardWaterQuality"),
      },
      {
        type: "text",
        title: t("landing.title2"),
        body: t("landing.cardBeforeDrillBody"),
      },
      {
        type: "image",
        title: t("landing.cardSiteMbeya"),
        src: "/images/side-3.jpeg",
        caption: t("landing.cardPreview"),
      },
    ],
    [t]
  );

  return (
    <section className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-fixed bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-pump.jpg')" }}
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-screen p-6 md:p-12 max-w-7xl mx-auto">
        <div className="lg:col-span-7">
          <div className="bg-white/20 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1 text-xs text-white w-fit drop-shadow-sm">
            {t("landing.badge")}
          </div>

          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] tracking-tight max-w-xl drop-shadow-sm">
            {t("landing.title1")}{" "}
            <span className="text-blue-300 drop-shadow-sm">{t("landing.title2")}</span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-white max-w-lg leading-relaxed drop-shadow-sm">
            {t("landing.subtitle")}
          </p>

          {/* Primary blue — same as Login / Register */}
          <div className="mt-8">
            <Link
              to="/register"
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-full px-7 py-3 shadow-lg shadow-blue-500/30 transition-all"
            >
              {t("landing.cta")}
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 border-t border-white/20 mt-8 z-10 relative">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">
                <Counter to={1240} />
                <span className="text-blue-400">+</span>
              </p>
              <p className="text-[10px] sm:text-xs text-white font-medium mt-1 drop-shadow-sm">
                {t("landing.stat1")}
              </p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">
                <Counter to={89} />
                <span className="text-blue-400">%</span>
              </p>
              <p className="text-[10px] sm:text-xs text-white font-medium mt-1 drop-shadow-sm">
                {t("landing.stat2")}
              </p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">
                <Counter to={26} />
              </p>
              <p className="text-[10px] sm:text-xs text-white font-medium mt-1 drop-shadow-sm">
                {t("landing.stat3")}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 w-full">
          <div
            className="relative h-[280px] sm:h-[380px] md:h-[520px] lg:h-[650px] overflow-hidden flex gap-2 sm:gap-4"
            style={scrollMaskStyle}
          >
            <ScrollColumn cards={cardsA} direction="up" duration={25} />
            <ScrollColumn cards={cardsB} direction="down" duration={28} />
          </div>
        </div>
      </div>
    </section>
  );
}