import { useEffect, useState } from "react";
import { api } from "../../services/api";

export default function Users() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);
  const [newPass, setNewPass] = useState("");
  const [msg, setMsg] = useState("");

  const me = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();

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

  const filtered = rows.filter((u) => {
    const s = q.toLowerCase();
    if (!s) return true;
    return (
      (u.email || "").toLowerCase().includes(s) ||
      (u.name || u.full_name || "").toLowerCase().includes(s)
    );
  });

  const onDelete = async (u) => {
    if (u.role === "super_admin" || u.email === me.email) {
      alert("Cannot delete this account");
      return;
    }
    if (!window.confirm("Delete " + u.email + "?")) return;
    try {
      await api.deleteUser(u.id);
      setSelected(null);
      await load();
    } catch (e) {
      alert(e.message || "Delete failed");
    }
  };

  const onRole = async (u, role) => {
    if (u.role === "super_admin") return;
    try {
      await api.updateUserRole(u.id, role);
      await load();
    } catch (e) {
      alert(e.message || "Role update failed");
    }
  };

  const onResetPassword = async () => {
    if (!selected) return;
    try {
      await api.adminResetPassword(selected.id, newPass);
      setMsg("Password updated");
      setNewPass("");
    } catch (e) {
      setErr(e.message || "Reset failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div>
        <h1 className="text-xl font-bold">Users</h1>
        <p className="text-sm text-slate-500">Manage accounts</p>
      </div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search…"
        className="w-full max-w-sm rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-900"
      />
      {(err || msg) && (
        <p className={"text-sm px-3 py-2 rounded-lg " + (err ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-800")}>
          {err || msg}
        </p>
      )}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs text-slate-500">
            <tr>
              <th className="px-3 py-2">Name / Email</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={4} className="px-3 py-8 text-center text-slate-400">Loading…</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={4} className="px-3 py-8 text-center text-slate-400">No users</td></tr>
            )}
            {filtered.map((u) => (
              <tr key={u.id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-3 py-2">
                  <button type="button" className="text-left hover:underline" onClick={() => { setSelected(u); setNewPass(""); setMsg(""); setErr(""); }}>
                    <p className="font-medium">{u.name || u.full_name || "—"}</p>
                    <p className="text-xs text-slate-500">{u.email}</p>
                  </button>
                </td>
                <td className="px-3 py-2">
                  <select
                    className="text-xs border rounded-md px-2 py-1 bg-transparent border-slate-200 dark:border-slate-700"
                    value={u.role || "user"}
                    disabled={u.role === "super_admin"}
                    onChange={(e) => onRole(u, e.target.value)}
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                    <option value="super_admin">super_admin</option>
                  </select>
                </td>
                <td className="px-3 py-2 text-xs">{u.is_active === false ? "Blocked" : "Active"}</td>
                <td className="px-3 py-2 text-right space-x-2">
                  <button type="button" className="text-xs text-blue-600 hover:underline" onClick={() => setSelected(u)}>Profile</button>
                  <button
                    type="button"
                    className="text-xs text-red-600 hover:underline disabled:opacity-40"
                    disabled={u.role === "super_admin" || u.email === me.email}
                    onClick={() => onDelete(u)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-md h-full bg-white dark:bg-slate-900 p-6 shadow-2xl overflow-y-auto border-l border-slate-200 dark:border-slate-800">
            <div className="flex justify-between">
              <h2 className="text-lg font-bold">User profile</h2>
              <button type="button" className="text-sm text-slate-500" onClick={() => setSelected(null)}>Close</button>
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <div><dt className="text-xs text-slate-500">Name</dt><dd className="font-medium">{selected.name || selected.full_name || "—"}</dd></div>
              <div><dt className="text-xs text-slate-500">Email</dt><dd className="font-medium">{selected.email}</dd></div>
              <div><dt className="text-xs text-slate-500">Role</dt><dd className="font-medium">{selected.role}</dd></div>
            </dl>
            <div className="mt-6">
              <p className="text-xs font-semibold text-slate-500 mb-2">New password (no rules)</p>
              <input type="text" value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="New password" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm mb-2" />
              <button type="button" onClick={onResetPassword} className="w-full py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold">Save password</button>
            </div>
            {selected.role !== "super_admin" && selected.email !== me.email && (
              <button type="button" onClick={() => onDelete(selected)} className="mt-6 w-full py-2 rounded-lg border border-red-200 text-red-600 text-sm font-semibold">Delete user</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}