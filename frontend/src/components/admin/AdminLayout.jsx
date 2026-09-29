import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearToken } from "../../services/api";
import { isSuperAdmin, normalizeRole } from "../../utils/roles";

export default function AdminLayout() {
  const navigate = useNavigate();
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch (_) {}
  const role = normalizeRole(user?.role);
  const superA = isSuperAdmin(role);

  const logout = () => {
    clearToken?.();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const link =
    "block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800";
  const active = "bg-blue-600 text-white hover:bg-blue-600";

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      <aside className="w-56 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
        <p className="font-bold text-sm mb-1">GP Admin</p>
        <p className="text-[10px] uppercase text-blue-600 mb-4">
          {superA ? "Super Admin" : "Admin"}
        </p>
        <nav className="space-y-1">
          <NavLink to="/admin/overview" className={({ isActive }) => `${link} ${isActive ? active : ""}`}>
            Overview
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => `${link} ${isActive ? active : ""}`}>
            Users
          </NavLink>
          <NavLink to="/admin/predictions" className={({ isActive }) => `${link} ${isActive ? active : ""}`}>
            Predictions
          </NavLink>
          <NavLink to="/admin/regions" className={({ isActive }) => `${link} ${isActive ? active : ""}`}>
            Regions
          </NavLink>
          {superA && (
            <NavLink to="/admin/settings" className={({ isActive }) => `${link} ${isActive ? active : ""}`}>
              Settings
            </NavLink>
          )}
        </nav>
        <button type="button" onClick={logout} className="mt-6 text-sm text-red-600">
          Logout
        </button>
      </aside>
      <main className="flex-1 p-6">
        <Outlet context={{ user, role, superA }} />
      </main>
    </div>
  );
}