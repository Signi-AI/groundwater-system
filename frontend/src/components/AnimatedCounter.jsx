import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

function Counter({ value, suffix = "", duration = 1.6 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 60, damping: 20 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) motionVal.set(value);
  }, [inView, value, motionVal]);

  useEffect(() => {
    const unsub = spring.on("change", (v) => setDisplay(Math.round(v)));
    return unsub;
  }, [spring]);

  return (
    <span ref={ref} className="tabular-nums">
      {display.toLocaleString()}
      {suffix && (
        <span className="relative inline-block ml-0.5">
          <span className="relative z-10 text-[#7dd3fc] drop-shadow-[0_0_8px_rgba(34,211,238,0.85)]">
            {suffix}
          </span>
          <span className="absolute inset-0 blur-md bg-cyan-400/40 animate-pulse rounded-full" />
        </span>
      )}
    </span>
  );
}

export default function StatsBar({ items }) {
  // items: [{ value: 1240, suffix: '+', label: '...' }, ...]
  return (
    <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4">
      {items.map((item) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="text-center sm:text-left"
        >
          <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            <Counter value={item.value} suffix={item.suffix || ""} />
          </p>
          <p className="mt-1 text-xs sm:text-sm text-white/70 font-medium">
            {item.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}