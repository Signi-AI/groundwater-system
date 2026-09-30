import { useEffect, useState } from "react";
import { api } from "../../services/api";

export default function Users() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");

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

  const onDelete = async (u) => {
    if (u.email === me.email || u.role === "super_admin") {
      alert("Cannot delete this account");
      return;
    }
    if (!window.confirm(`Delete ${u.email}?`)) return;
    try {
      await api.deleteUser(u.id);
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

  const filtered = rows.filter((u) => {
    const s = q.toLowerCase();
    if (!s) return true;
    return (
      (u.email || "").toLowerCase().includes(s) ||
      (u.name || u.full_name || "").toLowerCase().includes(s)
    );
  });

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div>
        <h1 className="text-xl font-bold">Users</h1>
        <p className="text-sm text-slate-500">All registered accounts</p>
      </div>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search name or email…"
        className="w-full max-w-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
      />

      {err && (
        <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg">
          {err}
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
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-slate-400">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-slate-400">
                  No users
                </td>
              </tr>
            )}
            {filtered.map((u) => (
              <tr key={u.id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-3 py-2">
                  <p className="font-medium">{u.name || u.full_name || "—"}</p>
                  <p className="text-xs text-slate-500">{u.email}</p>
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
                <td className="px-3 py-2 text-xs">
                  {u.is_active === false ? "Blocked" : "Active"}
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => onDelete(u)}
                    disabled={u.role === "super_admin" || u.email === me.email}
                    className="text-xs text-red-600 hover:underline disabled:opacity-40"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}