import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const color = useTransform(
    progress,
    range,
    ["rgb(120, 120, 128)", "rgb(255, 255, 255)"]
  );

  return (
    <motion.span
      style={{ opacity, color }}
      className="inline-block mr-[0.28em] last:mr-0 will-change-[opacity,color]"
    >
      {children}
    </motion.span>
  );
}

/**
 * Apple-style: words go dim → bright white as you scroll through the block.
 */
export default function ScrollRevealText({
  text,
  as: Tag = "p",
  className = "",
  /** scroll offsets [start, end] relative to element */
  offset = ["start 0.95", "start 0.35"],
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  });

  const words = String(text || "").trim().split(/\s+/);

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = Math.min(1, start + 1.2 / words.length);
        return (
          <Word key={`${word}-${i}`} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </Tag>
  );
}