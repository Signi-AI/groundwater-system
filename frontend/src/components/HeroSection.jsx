import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
} from "framer-motion";

const CARDS_COL_A = [
  { type: "stat", title: "Kina cha Maji", value: "45m", hint: "Inatarajiwa" },
  {
    type: "text",
    title: "Uchambuzi wa tovuti",
    body: "Unganisha eneo, jiolojia na data ya mazingira kwa tathmini moja.",
  },
  { type: "stat", title: "Usahihi", value: "92%", hint: "Model confidence" },
  { type: "image", title: "Tovuti – Dodoma", src: "/images/side-1.jpeg" },
  {
    type: "text",
    title: "Matokeo ya haraka",
    body: "Pata uwezekano, kina, uzalishaji na ubora kwenye ripoti wazi.",
  },
  { type: "stat", title: "Uwezekano", value: "HIGH", hint: "Water potential" },
];

const CARDS_COL_B = [
  {
    type: "text",
    title: "Lengo la Tanzania",
    body: "Imeundwa kwa hali za kikanda na maamuzi shambani.",
  },
  { type: "stat", title: "Mikoa", value: "26", hint: "Coverage" },
  { type: "image", title: "Tovuti – Arusha", src: "/images/side-2.jpeg" },
  { type: "stat", title: "pH", value: "7.2", hint: "Ubora wa maji" },
  {
    type: "text",
    title: "Kabla Hujachimba",
    body: "Punguza gharama na hatari kwa mwongozo wa data.",
  },
  { type: "image", title: "Tovuti – Mbeya", src: "/images/side-3.jpeg" },
];

function Counter({ from = 0, to, duration = 2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) =>
    Math.round(latest).toLocaleString()
  );

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, to, {
      duration,
      ease: "easeOut",
    });
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
    "backdrop-blur-md bg-blue-950/40 border border-blue-400/20 hover:border-blue-500/50 hover:shadow-blue-500/10 p-5 rounded-2xl shadow-xl shadow-blue-950/20 transition-all duration-300 group text-white";

  if (card.type === "stat") {
    return (
      <div className={base}>
        <p className="text-xs text-blue-200/80 uppercase tracking-wide">
          {card.title}
        </p>
        <p className="mt-1 text-2xl font-extrabold text-blue-400 group-hover:text-blue-300 transition-colors">
          {card.value}
        </p>
        {card.hint && (
          <p className="mt-1 text-xs text-blue-200/70">{card.hint}</p>
        )}
      </div>
    );
  }

  if (card.type === "image") {
    return (
      <div className="backdrop-blur-md bg-blue-950/40 border border-blue-400/20 hover:border-blue-500/50 hover:shadow-blue-500/10 rounded-2xl overflow-hidden shadow-xl shadow-blue-950/20 transition-all duration-300 group">
        <div className="relative border-b border-blue-400/20">
          <img
            src={card.src}
            alt={card.title}
            className="h-28 sm:h-32 md:h-36 w-full object-cover"
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-blue-400/20" />
        </div>
        <div className="p-3 sm:p-4">
          <p className="text-sm font-bold text-white">{card.title}</p>
          <p className="text-xs text-blue-200/80 mt-0.5">Site preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className={base}>
      <p className="text-sm font-bold text-white">{card.title}</p>
      <p className="mt-2 text-xs text-blue-200/80 leading-relaxed">{card.body}</p>
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

const textShadow = {
  textShadow: "0 2px 8px rgba(0,0,0,0.85), 0 1px 2px rgba(0,0,0,0.6)",
};

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-fixed bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-pump.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-screen p-6 md:p-12 max-w-7xl mx-auto">
        {/* Left */}
        <div className="lg:col-span-7">
          <div
            className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1 text-xs text-white w-fit drop-shadow-lg"
            style={textShadow}
          >
            Usaidizi wa maamuzi · Sekta ya maji Tanzania
          </div>

          <h1
            className="mt-6 text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] tracking-tight max-w-xl drop-shadow-lg"
            style={textShadow}
          >
            Tafuta Maji.{" "}
            <span className="text-blue-300" style={textShadow}>
              Kabla Hujachimba.
            </span>
          </h1>

          <p
            className="mt-5 text-sm sm:text-base text-white max-w-lg leading-relaxed drop-shadow-md"
            style={textShadow}
          >
            Weka data ya tovuti — pata mwongozo wa kina, usahihi wa 89%, na
            taarifa za kina za kijiolojia.
          </p>

          <div className="mt-8">
            <Link
              to="/register"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl px-7 py-3 shadow-lg shadow-blue-500/30 transition-all"
            >
              Anza Kubashiri
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 border-t border-white/15 mt-8 z-10 relative">
            <div>
              <p
                className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-lg"
                style={textShadow}
              >
                <Counter to={1240} />
                <span className="text-blue-400">+</span>
              </p>
              <p
                className="text-[10px] sm:text-xs text-white/90 font-medium mt-1"
                style={textShadow}
              >
                Tovuti Zilizochambuliwa
              </p>
            </div>
            <div>
              <p
                className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-lg"
                style={textShadow}
              >
                <Counter to={89} />
                <span className="text-blue-400">%</span>
              </p>
              <p
                className="text-[10px] sm:text-xs text-white/90 font-medium mt-1"
                style={textShadow}
              >
                Usahihi Unaolengwa
              </p>
            </div>
            <div>
              <p
                className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-lg"
                style={textShadow}
              >
                <Counter to={26} />
              </p>
              <p
                className="text-[10px] sm:text-xs text-white/90 font-medium mt-1"
                style={textShadow}
              >
                Mikoa
              </p>
            </div>
          </div>
        </div>

        {/* Right — visible on ALL screens (including mobile) */}
        <div className="lg:col-span-5 w-full">
          <div
            className="relative h-[280px] xs:h-[300px] sm:h-[380px] md:h-[520px] lg:h-[650px] overflow-hidden flex gap-2 sm:gap-4"
            style={scrollMaskStyle}
          >
            <ScrollColumn cards={CARDS_COL_A} direction="up" duration={25} />
            <ScrollColumn cards={CARDS_COL_B} direction="down" duration={28} />
          </div>
        </div>
      </div>
    </section>
  );
}