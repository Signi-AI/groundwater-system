import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const MESSAGES = {
  login: "Welcome back! Good to see you. Log in and find your water.",
  register: "You are welcome to GP! Please register or login to continue.",
  forgot: "Oh no! Forgot your password? Let's get it back together.",
};

export default function AuthMascot({ mode = "login" }) {
  const text = MESSAGES[mode] || MESSAGES.login;

  return (
    <div className="relative flex justify-center md:justify-start w-full md:w-auto shrink-0 pt-16 sm:pt-20 md:pt-24">
      <div className="relative inline-block">
        {/* Bubble — smaller text, tighter box */}
        <div className="absolute z-20 left-1/2 -translate-x-1/2 -top-12 sm:-top-14 md:-top-16 w-[min(200px,85vw)] sm:w-[220px] md:w-[240px]">
          <div className="relative rounded-xl backdrop-blur-md bg-slate-900/85 border border-white/10 shadow-lg px-3 py-2 sm:px-3.5 sm:py-2.5">
            <AnimatePresence mode="wait">
              <motion.p
                key={mode}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.2 }}
                className="text-[10px] sm:text-[11px] md:text-xs leading-snug text-slate-100 text-center font-medium"
              >
                {text}
              </motion.p>
            </AnimatePresence>
            <div
              className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-2.5 h-2.5 rotate-45 bg-slate-900/85 border-r border-b border-white/10"
              aria-hidden
            />
          </div>
        </div>

        {/* Mdoli — slightly larger */}
        <motion.img
          src={`${process.env.PUBLIC_URL || ""}/mascot-driller.png`}
          alt="GP Driller"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          className="
            relative z-10
            w-[22rem]
            sm:w-[26rem]
            md:w-[30rem]
            lg:w-[34rem]
            xl:w-[38rem]
            h-auto max-w-[96vw]
            object-contain drop-shadow-2xl select-none pointer-events-none
          "
        />
      </div>
    </div>
  );
}