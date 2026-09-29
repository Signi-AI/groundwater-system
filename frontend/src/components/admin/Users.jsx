import React, { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { MoreHorizontal, Search, Trash2, UserCog, KeyRound, Ban } from "lucide-react";
import { api } from "../../services/api";
import { can } from "../../utils/roles";
import ConfirmModal from "../../components/admin/ConfirmModal";

const roles = ["all", "super_admin", "admin", "user"];
const statuses = ["all", "active", "deactivated"];

export default function Users() {
  const { role } = useOutletContext() || {};
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [roleF, setRoleF] = useState("all");
  const [statusF, setStatusF] = useState("all");
  const [menuId, setMenuId] = useState(null);
  const [confirm, setConfirm] = useState(null); // { type, user }
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const data = api?.listUsers ? await api.listUsers() : [];
      setRows(Array.isArray(data) ? data : data?.items || []);
    } catch (e) {
      setErr(e.message || "Failed to load users");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return rows.filter((u) => {
      const hay = `${u.name || ""} ${u.email || ""}`.toLowerCase();
      if (q && !hay.includes(q.toLowerCase())) return false;
      if (roleF !== "all" && String(u.role).toLowerCase() !== roleF) return false;
      const st = u.is_active === false || u.status === "deactivated" ? "deactivated" : "active";
      if (statusF !== "all" && st !== statusF) return false;
      return true;
    });
  }, [rows, q, roleF, statusF]);

  const runDelete = async () => {
    if (!confirm?.user || !can(role, "delete_user")) return;
    setBusy(true);
    try {
      await api.deleteUser(confirm.user.id);
      setConfirm(null);
      await load();
    } catch (e) {
      setErr(e.message || "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  const runRoleChange = async (userId, newRole) => {
    if (!can(role, "change_role")) return;
    if (newRole === "super_admin" && !can(role, "promote_super_admin")) return;
    setBusy(true);
    try {
      await api.updateUserRole(userId, newRole);
      setMenuId(null);
      await load();
    } catch (e) {
      setErr(e.message || "Role update failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-sm text-slate-500">Manage accounts and roles</p>
        </div>
      </div>

      {err && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-2">{err}</div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name or email"
            className="bg-transparent text-sm outline-none w-full"
          />
        </div>
        <select
          value={roleF}
          onChange={(e) => setRoleF(e.target.value)}
          className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
        >
          {roles.map((r) => (
            <option key={r} value={r}>
              Role: {r}
            </option>
          ))}
        </select>
        <select
          value={statusF}
          onChange={(e) => setStatusF(e.target.value)}
          className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              Status: {s}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                  No users found
                </td>
              </tr>
            )}
            {filtered.map((u) => {
              const active = !(u.is_active === false || u.status === "deactivated");
              const targetIsSuper = String(u.role).toLowerCase() === "super_admin";
              return (
                <tr key={u.id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 flex items-center justify-center text-xs font-bold">
                        {(u.name || u.email || "?")[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{u.name || "—"}</p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {active ? "active" : "deactivated"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-right relative">
                    <button
                      type="button"
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      onClick={() => setMenuId(menuId === u.id ? null : u.id)}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {menuId === u.id && (
                      <div className="absolute right-4 top-10 z-20 w-48 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl py-1 text-left">
                        {can(role, "change_role") && !targetIsSuper && (
                          <>
                            <button
                              type="button"
                              className="w-full px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                              onClick={() => runRoleChange(u.id, "admin")}
                            >
                              <UserCog className="w-3.5 h-3.5" /> Make admin
                            </button>
                            <button
                              type="button"
                              className="w-full px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                              onClick={() => runRoleChange(u.id, "user")}
                            >
                              <UserCog className="w-3.5 h-3.5" /> Make user
                            </button>
                          </>
                        )}
                        {can(role, "reset_password") && (
                          <button
                            type="button"
                            className="w-full px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                            onClick={async () => {
                              try {
                                await api.adminResetPassword?.(u.id);
                                setMenuId(null);
                              } catch (e) {
                                setErr(e.message);
                              }
                            }}
                          >
                            <KeyRound className="w-3.5 h-3.5" /> Reset password
                          </button>
                        )}
                        {can(role, "delete_user") && !targetIsSuper && (
                          <button
                            type="button"
                            className="w-full px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                            onClick={() => {
                              setMenuId(null);
                              setConfirm({ type: "delete", user: u });
                            }}
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        )}
                        {!can(role, "delete_user") && !can(role, "change_role") && (
                          <p className="px-3 py-2 text-xs text-slate-400">View only</p>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={!!confirm}
        danger
        title="Delete user"
        message={`Permanently delete ${confirm?.user?.email}? This cannot be undone.`}
        requireText="DELETE"
        confirmLabel="Delete user"
        loading={busy}
        onClose={() => setConfirm(null)}
        onConfirm={runDelete}
      />
    </div>
  );
}