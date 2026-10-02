import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Sidebar({ open, onClose }) {
  const { t } = useTranslation();

  const navItems = [
    { to: "/app/dashboard", label: t("nav.dashboard") || "Dashboard", icon: "D" },
    { to: "/app/predict", label: t("nav.predict") || "Predict", icon: "P" },
    { to: "/app/history", label: t("nav.history") || "History", icon: "H" },
    { to: "/app/map", label: t("nav.map") || "Map", icon: "M" },
    { to: "/app/settings", label: t("nav.settings") || "Settings", icon: "S" },
  ];

  return (
    <>
      {/* Overlay — simu tu; funga sidebar */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden={!open}
      />

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 shrink-0 min-h-screen bg-[#135AAD] dark:bg-slate-900 text-white flex flex-col
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-sm font-bold">
              GP
            </div>
            <div>
              <p className="text-xs font-semibold leading-tight">GROUNDWATER</p>
              <p className="text-[10px] text-blue-200 leading-tight">
                PREDICTION SYSTEM
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden text-white/80 hover:text-white text-xl leading-none"
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-white text-[#135AAD] shadow-sm"
                    : "text-blue-100 hover:bg-white/10"
                }`
              }
            >
              <span className="w-6 h-6 rounded bg-white/20 flex items-center justify-center text-xs shrink-0">
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <p className="text-[10px] uppercase tracking-wider text-blue-200 mb-1">
            Model Status
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
            <span className="text-xs text-blue-100">Online · v2.1.4</span>
          </div>
        </div>
      </aside>
    </>
  );
}