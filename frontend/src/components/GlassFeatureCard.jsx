import React from "react";
import { motion } from "framer-motion";

/**
 * Glass card + continuous cyan border ray (conic-gradient spin)
 */
export default function GlassFeatureCard({ title, desc, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-2xl p-[1px] overflow-hidden"
    >
      {/* Animated ray border */}
      <div
        className="absolute inset-[-50%] opacity-70 group-hover:opacity-100 transition-opacity duration-500 animate-[spin_4s_linear_infinite]"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, transparent 300deg, #22d3ee 320deg, #67e8f9 340deg, transparent 360deg)",
        }}
      />
      {/* Soft static edge */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-white/15 pointer-events-none" />

      {/* Glass body */}
      <div className="relative h-full rounded-2xl bg-white/10 dark:bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 shadow-xl">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        <h3 className="relative font-bold text-white mb-2 text-base sm:text-lg">
          {title}
        </h3>
        <p className="relative text-sm text-white/75 leading-relaxed">
          {desc}
        </p>
      </div>
    </motion.div>
  );
}