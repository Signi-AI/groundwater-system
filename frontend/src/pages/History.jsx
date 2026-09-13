import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../services/api";

export default function History() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .getPredictions()
      .then(function (data) {
        setItems(Array.isArray(data) ? data : data.items || []);
      })
      .catch(function (e) {
        setError(e.message || "Failed to load history");
      })
      .finally(function () {
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          {t("nav.history")}
        </h1>
        <p className="text-sm text-slate-500">Your past groundwater predictions</p>
      </div>

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-6 text-sm text-slate-400">Loading…</p>
        ) : items.length === 0 ? (
          <p className="p-6 text-sm text-slate-400">No predictions yet. Run one from Predict.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Region</th>
                  <th className="px-4 py-3">Lat / Lng</th>
                  <th className="px-4 py-3">Potential</th>
                  <th className="px-4 py-3">Depth</th>
                  <th className="px-4 py-3">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {items.map(function (row) {
                  return (
                    <tr
                      key={row.id || row.created_at}
                      className="border-t border-slate-100 dark:border-slate-800"
                    >
                      <td className="px-4 py-3 text-slate-600">
                        {row.created_at
                          ? new Date(row.created_at).toLocaleString()
                          : "—"}
                      </td>
                      <td className="px-4 py-3">{row.region || "—"}</td>
                      <td className="px-4 py-3 font-mono text-xs">
                        {row.latitude != null ? Number(row.latitude).toFixed(4) : "—"}
                        {", "}
                        {row.longitude != null ? Number(row.longitude).toFixed(4) : "—"}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {row.water_potential || row.potential || "—"}
                      </td>
                      <td className="px-4 py-3">
                        {row.depth || row.expected_depth || "—"}
                      </td>
                      <td className="px-4 py-3">
                        {row.confidence != null ? row.confidence + "%" : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}