import React, { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { api } from "../../services/api";
import { can } from "../../utils/roles";
import ConfirmModal from "../../components/admin/ConfirmModal";

export default function Users() {
  const { role } = useOutletContext() || {};
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null); // profile drawer
  const [confirm, setConfirm] = useState(null); // { type, user }
  const [newPass, setNewPass] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const data = await api.listUsers();
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
    const s = q.toLowerCase();
    return rows.filter(
      (u) =>
        !s ||
        (u.email || "").toLowerCase().includes(s) ||
        (u.name || u.full_name || "").toLowerCase().includes(s)
    );
  }, [rows, q]);

  const openProfile = (u) => {
    setSelected(u);
    setNewPass("");
    setMsg("");
  };

  const doDelete = async () => {
    if (!can(role, "delete_user") || !confirm?.user) return;
    setBusy(true);
    try {
      await api.deleteUser(confirm.user.id);
      setConfirm(null);
      setSelected(null);
      setMsg("User deleted");
      await load();
    } catch (e) {
      setErr(e.message || "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  const doResetPassword = async () => {
    if (!selected || !can(role, "reset_password")) return;
    if (newPass.length < 6) {
      setErr("Password min 6 characters");
      return;
    }
    setBusy(true);
    setErr("");
    try {
      // Prefer admin reset endpoint; fallback PATCH
      if (api.adminResetPassword) {
        await api.adminResetPassword(selected.id, newPass);
      } else {
        await api.updateUser?.(selected.id, { password: newPass });
      }
      setMsg(`Password updated for ${selected.email}`);
      setNewPass("");
    } catch (e) {
      setErr(e.message || "Reset failed");
    } finally {
      setBusy(false);
    }
  };

  const doSetRole = async (userId, newRole) => {
    if (!can(role, "change_role")) return;
    setBusy(true);
    try {
      await api.updateUserRole(userId, newRole);
      setMsg("Role updated");
      await load();
      if (selected?.id === userId) {
        setSelected((s) => ({ ...s, role: newRole }));
      }
    } catch (e) {
      setErr(e.message || "Role update failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Users</h1>
        <p className="text-sm text-slate-500 mt-1">
          Security & account management — not prediction tools
        </p>
      </div>

      {(msg || err) && (
        <div
          className={`text-sm rounded-xl px-4 py-2 border ${
            err
              ? "bg-red-50 text-red-700 border-red-200"
              : "bg-emerald-50 text-emerald-800 border-emerald-200"
          }`}
        >
          {err || msg}
        </div>
      )}

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search name or email…"
        className="w-full sm:max-w-md rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
      />

      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase text-slate-500 text-left">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                  No users
                </td>
              </tr>
            )}
            {filtered.map((u) => (
              <tr key={u.id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => openProfile(u)}
                    className="text-left hover:underline"
                  >
                    <p className="font-medium">{u.name || u.full_name || "—"}</p>
                    <p className="text-xs text-slate-500">{u.email}</p>
                  </button>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {u.is_active === false ? "deactivated" : "active"}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    type="button"
                    onClick={() => openProfile(u)}
                    className="text-xs font-medium text-blue-600 hover:underline"
                  >
                    Profile
                  </button>
                  {can(role, "delete_user") && u.role !== "super_admin" && (
                    <button
                      type="button"
                      onClick={() => setConfirm({ type: "delete", user: u })}
                      className="text-xs font-medium text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Profile panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-md h-full bg-white dark:bg-slate-900 shadow-2xl p-6 overflow-y-auto border-l border-slate-200 dark:border-slate-800">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold">User profile</h2>
                <p className="text-xs text-slate-500 mt-0.5">Assistance & security</p>
              </div>
              <button type="button" className="text-sm text-slate-500" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>

            <dl className="mt-6 space-y-3 text-sm">
              <div>
                <dt className="text-xs text-slate-500">Name</dt>
                <dd className="font-medium">{selected.name || selected.full_name || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Email</dt>
                <dd className="font-medium">{selected.email}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Role</dt>
                <dd>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
                    {selected.role}
                  </span>
                </dd>
              </div>
            </dl>

            {can(role, "change_role") && selected.role !== "super_admin" && (
              <div className="mt-6">
                <p className="text-xs font-semibold text-slate-500 mb-2">Change role</p>
                <div className="flex flex-wrap gap-2">
                  {["user", "admin"].map((r) => (
                    <button
                      key={r}
                      type="button"
                      disabled={busy}
                      onClick={() => doSetRole(selected.id, r)}
                      className="px-3 py-1.5 rounded-lg text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {can(role, "reset_password") && (
              <div className="mt-6">
                <p className="text-xs font-semibold text-slate-500 mb-2">Reset password</p>
                <input
                  type="text"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="New password"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm mb-2"
                />
                <button
                  type="button"
                  disabled={busy}
                  onClick={doResetPassword}
                  className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold"
                >
                  Save new password
                </button>
              </div>
            )}

            {can(role, "delete_user") && selected.role !== "super_admin" && (
              <button
                type="button"
                className="mt-8 w-full py-2 rounded-lg border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50"
                onClick={() => setConfirm({ type: "delete", user: selected })}
              >
                Delete this user
              </button>
            )}
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!confirm}
        danger
        title="Delete user"
        message={`Delete ${confirm?.user?.email}? This cannot be undone.`}
        requireText="DELETE"
        confirmLabel="Delete"
        loading={busy}
        onClose={() => setConfirm(null)}
        onConfirm={doDelete}
      />
    </div>
  );
}