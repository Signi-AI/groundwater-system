import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearToken } from "../../services/api";

const link = "block px-3 py-2.5 rounded-lg text-sm font-medium transition";
const on = "bg-blue-600 text-white";
const off = "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800";

export default function AdminLayout() {
  const navigate = useNavigate();
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch (_) {}

  const logout = () => {
    clearToken();
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <aside className="w-56 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <p className="font-bold text-sm">GP Admin</p>
          <p className="text-[10px] uppercase text-blue-600 font-semibold">Super Admin</p>
          <p className="text-xs text-slate-500 mt-2 truncate">{user?.email}</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <NavLink to="/admin/users" className={({ isActive }) => `${link} ${isActive ? on : off}`}>
            Users
          </NavLink>
          <NavLink to="/admin/predictions" className={({ isActive }) => `${link} ${isActive ? on : off}`}>
            Predictions
          </NavLink>
        </nav>
        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
          <button type="button" onClick={logout} className="w-full text-left px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30">
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-4 sm:p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}