import { useEffect, useState } from "react";
import { api } from "../../services/api";

export default function Predictions() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await api.listAllPredictions();
        setRows(Array.isArray(data) ? data : data?.items || []);
      } catch (e) {
        setErr(e.message || "Failed to load");
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div>
        <h1 className="text-xl font-bold">All predictions</h1>
        <p className="text-sm text-slate-500">Every assessment in the system</p>
      </div>
      {err && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{err}</p>}
      <div className="w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
  <table className="min-w-[700px] w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs text-slate-500">
            <tr>
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">User</th>
              <th className="px-3 py-2">Location</th>
              <th className="px-3 py-2">Potential</th>
              <th className="px-3 py-2">Depth</th>
              <th className="px-3 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} className="px-3 py-8 text-center text-slate-400">Loading…</td></tr>
            )}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={6} className="px-3 py-8 text-center text-slate-400">No predictions</td></tr>
            )}
            {rows.map((p) => (
              <tr key={p.id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-3 py-2 text-xs">#{p.id}</td>
                <td className="px-3 py-2">{p.user_name || p.user_email || p.user_id || "—"}</td>
                <td className="px-3 py-2 text-xs">
                  {p.latitude != null ? `${p.latitude}, ${p.longitude}` : p.region || "—"}
                </td>
                <td className="px-3 py-2">{p.water_potential || p.potential || "—"}</td>
                <td className="px-3 py-2">{p.depth || p.expected_depth || "—"}</td>
                <td className="px-3 py-2 text-xs text-slate-500">
                  {p.created_at ? new Date(p.created_at).toLocaleDateString() : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}