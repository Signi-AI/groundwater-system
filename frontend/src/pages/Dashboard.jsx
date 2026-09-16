import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { useNotifications } from "../context/NotificationContext";
import { api } from "../services/api";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function buildTrend(items) {
  const map = {};
  MONTHS.forEach((m) => {
    map[m] = { month: m, predictions: 0, high: 0 };
  });

  items.forEach((row) => {
    if (!row.created_at) return;
    const d = new Date(row.created_at);
    if (Number.isNaN(d.getTime())) return;
    const m = MONTHS[d.getMonth()];
    if (!map[m]) return;
    map[m].predictions += 1;
    const pot = String(row.water_potential || row.potential || "").toUpperCase();
    if (pot === "HIGH") map[m].high += 1;
  });

  return MONTHS.map((m) => map[m]);
}

function buildWeekly(items) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const counts = [0, 0, 0, 0, 0, 0, 0];
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  items.forEach((row) => {
    if (!row.created_at) return;
    const d = new Date(row.created_at);
    if (d < weekAgo) return;
    counts[d.getDay()] += 1;
  });

  return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((name) => {
    const idx = days.indexOf(name);
    return { name, value: counts[idx] };
  });
}

export default function Dashboard() {
  const { t } = useTranslation();
  const { items: notifItems, unread } = useNotifications();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .getPredictions()
      .then((data) => {
        setItems(Array.isArray(data) ? data : data.items || []);
      })
      .catch((e) => setError(e.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const trendData = useMemo(() => buildTrend(items), [items]);
  const barData = useMemo(() => buildWeekly(items), [items]);

  const total = items.length;
  const highCount = items.filter((r) =>
    String(r.water_potential || r.potential || "").toUpperCase() === "HIGH"
  ).length;
  const avgConf =
    total === 0
      ? 0
      : Math.round(
          items.reduce((s, r) => s + (Number(r.confidence) || 0), 0) / total
        );

  const stats = [
    {
      label: "Total Predictions",
      value: String(total),
      sub: loading ? "Loading…" : "From your account",
      color: "text-[#0F4C8A]",
      bg: "bg-gradient-to-br from-white to-[#E8F1FB]",
      border: "border-[#C5D9F0]",
    },
    {
      label: "High potential sites",
      value: String(highCount),
      sub: total ? Math.round((highCount / total) * 100) + "% of total" : "No data yet",
      color: "text-emerald-700",
      bg: "bg-gradient-to-br from-white to-emerald-50",
      border: "border-emerald-100",
    },
    {
      label: "Avg. Confidence",
      value: total ? avgConf + "%" : "—",
      sub: "Model confidence",
      color: "text-[#135AAD]",
      bg: "bg-gradient-to-br from-white to-sky-50",
      border: "border-sky-100",
    },
    {
      label: "Notifications",
      value: String(unread),
      sub: notifItems.length + " total",
      color: "text-[#C42A6B]",
      bg: "bg-gradient-to-br from-white to-pink-50",
      border: "border-pink-100",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-[#0F4C8A] to-[#135AAD] text-white px-6 py-5 shadow-md">
        <h1 className="text-2xl font-bold">{t("nav.dashboard")}</h1>
        <p className="text-sm text-blue-100 mt-1">
          Live overview from your saved predictions
        </p>
      </div>

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`rounded-2xl border ${s.border} ${s.bg} p-5 shadow-sm`}
          >
            <p className="text-[11px] uppercase tracking-wide text-slate-500 font-medium">
              {s.label}
            </p>
            <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#D6E4F5] p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-[#0F4C8A] mb-4">
            Monthly predictions (real data)
          </h3>
          {total === 0 && !loading ? (
            <p className="text-sm text-slate-400 py-16 text-center">
              No predictions yet. Run one on Predict page.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8F0FA" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="predictions" name="All" stroke="#135AAD" strokeWidth={2.5} />
                <Line type="monotone" dataKey="high" name="HIGH" stroke="#059669" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-[#D6E4F5] p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-[#0F4C8A] mb-4">
            Last 7 days activity
          </h3>
          {total === 0 && !loading ? (
            <p className="text-sm text-slate-400 py-16 text-center">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8F0FA" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip />
                <Bar dataKey="value" name="Predictions" fill="#135AAD" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#D6E4F5] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E8F0FA] bg-[#F3F7FC]">
          <h3 className="text-sm font-semibold text-[#0F4C8A]">Recent notifications</h3>
        </div>
        {notifItems.length === 0 ? (
          <p className="p-5 text-sm text-slate-400">
            No notifications. Run a prediction to see one here.
          </p>
        ) : (
          <ul className="divide-y divide-[#E8F0FA]">
            {notifItems.slice(0, 5).map((n) => (
              <li key={n.id} className="px-5 py-3 hover:bg-[#F7FAFD]">
                <p className="text-sm font-medium text-slate-800">{n.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}