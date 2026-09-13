import React, { useState, useRef, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Sidebar from "./Sidebar";
import { useTheme } from "../context/ThemeContext";
import { useNotifications } from "../context/NotificationContext";

export default function Layout() {
  const { dark, toggle } = useTheme();
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);
  const { items, unread, markAllRead, clearAll } = useNotifications();

  const isSw = i18n.language && i18n.language.startsWith("sw");
  const toggleLang = () => i18n.changeLanguage(isSw ? "en" : "sw");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("demo_user");
    navigate("/login");
  };

  useEffect(() => {
    const onClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#EEF3F9] dark:bg-slate-950 transition-colors">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600"
            >
              ☰
            </button>
            <div className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">
              {t("landing.brand")} · Tanzania
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="text-xs px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-white"
            >
              {dark ? "Light" : "Dark"}
            </button>

            {/* ONE language button — same as landing */}
            <button
              onClick={toggleLang}
              className="text-xs px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 font-semibold bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {isSw ? "SW → EN" : "EN → SW"}
            </button>

            {/* Notification bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  setNotifOpen((v) => !v);
                  if (!notifOpen) markAllRead();
                }}
                className="relative p-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600"
                title="Notifications"
              >
                🔔
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#E2397C] text-white text-[10px] flex items-center justify-center">
                    {unread}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      Notifications
                    </span>
                    <button onClick={clearAll} className="text-[10px] text-[#135AAD]">
                      Clear
                    </button>
                  </div>
                  {items.length === 0 ? (
                    <p className="p-4 text-xs text-slate-400 text-center">No notifications yet</p>
                  ) : (
                    items.map((n) => (
                      <div
                        key={n.id}
                        className={`px-3 py-2.5 border-b border-slate-50 dark:border-slate-800 ${
                          !n.read ? "bg-blue-50/60 dark:bg-slate-800/50" : ""
                        }`}
                      >
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{n.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{n.message}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <button
              onClick={logout}
              className="text-xs px-3 py-1.5 rounded-full border border-red-100 text-red-600 hover:bg-red-50 bg-white"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6 bg-[#EEF3F9] dark:bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}