import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearToken } from "../../services/api";

const linkBase =
  "block px-3 py-2.5 rounded-lg text-sm font-medium transition";
const linkOn = "bg-blue-600 text-white";
const linkOff =
  "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  let user = {};
  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch (_) {}

  const logout = () => {
    clearToken();
    localStorage.removeItem("user");
    navigate("/login");
  };

  const close = () => setOpen(false);

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div
        className={`fixed inset-0 z-40 bg-black/40 lg:hidden transition-opacity ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={close}
        aria-hidden={!open}
      />

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 shrink-0 flex flex-col
          border-r border-slate-200 dark:border-slate-800
          bg-white dark:bg-slate-900
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src="/images/water-finder-logo.png"
              alt="WATER FINDER"
              className="w-9 h-9 object-contain shrink-0 rounded-lg bg-slate-50 p-0.5 border border-slate-100 dark:border-slate-700"
            />
            <div className="min-w-0">
              <p className="font-bold text-sm truncate">WATER FINDER</p>
              <p className="text-[10px] uppercase text-blue-600 font-semibold tracking-wide">
                Super Admin
              </p>
              <p className="text-xs text-slate-500 mt-1 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            className="lg:hidden text-slate-500 text-xl leading-none p-1 shrink-0"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <NavLink
            to="/admin/users"
            onClick={close}
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkOn : linkOff}`
            }
          >
            Users
          </NavLink>
          <NavLink
            to="/admin/predictions"
            onClick={close}
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkOn : linkOff}`
            }
          >
            Predictions
          </NavLink>
        </nav>

        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={logout}
            className="w-full text-left px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 w-full">
        <header className="lg:hidden sticky top-0 z-30 h-12 px-3 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
            aria-label="Open menu"
          >
            ☰
          </button>
          <img
            src="/images/water-finder-logo.png"
            alt=""
            className="w-7 h-7 object-contain"
          />
          <span className="text-sm font-semibold truncate">WATER FINDER</span>
        </header>

        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}