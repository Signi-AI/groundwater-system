import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { useNotifications } from "../context/NotificationContext";
import { api } from "../services/api";

const trendData = [
  { month: "Jan", predictions: 18, success: 14 },
  { month: "Feb", predictions: 22, success: 17 },
  { month: "Mar", predictions: 28, success: 22 },
  { month: "Apr", predictions: 25, success: 20 },
  { month: "May", predictions: 32, success: 26 },
  { month: "Jun", predictions: 30, success: 24 },
];

const barData = [
  { name: "Mon", value: 12 },
  { name: "Tue", value: 18 },
  { name: "Wed", value: 15 },
  { name: "Thu", value: 22 },
  { name: "Fri", value: 19 },
  { name: "Sat", value: 8 },
  { name: "Sun", value: 5 },
];

export default function Dashboard() {
  const { t } = useTranslation();
  const { items, unread } = useNotifications();
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    api.getPredictions().then(setPredictions).catch(() => setPredictions([]));
  }, []);

  const successfulSites = predictions.filter((prediction) =>
    ["high", "excellent", "good"].includes(
      String(prediction.water_potential).toLowerCase()
    )
  ).length;
  const averageConfidence = predictions.length
    ? Math.round(
        predictions.reduce((total, prediction) => total + prediction.confidence, 0) /
          predictions.length
      )
    : 0;

  const stats = [
    {
      label: "Total Predictions",
      value: String(predictions.length),
      sub: "Saved predictions",
      color: "text-[#0F4C8A]",
      bg: "bg-gradient-to-br from-white to-[#E8F1FB]",
      border: "border-[#C5D9F0]",
    },
    {
      label: "Successful Sites",
      value: String(successfulSites),
      sub: predictions.length ? "High-potential sites" : "No results yet",
      color: "text-emerald-700",
      bg: "bg-gradient-to-br from-white to-emerald-50",
      border: "border-emerald-100",
    },
    {
      label: "Avg. Confidence",
      value: `${averageConfidence}%`,
      sub: "Average confidence",
      color: "text-[#135AAD]",
      bg: "bg-gradient-to-br from-white to-sky-50",
      border: "border-sky-100",
    },
    {
      label: "Notifications",
      value: String(unread),
      sub: `${items.length} total`,
      color: "text-[#C42A6B]",
      bg: "bg-gradient-to-br from-white to-pink-50",
      border: "border-pink-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0F4C8A] to-[#135AAD] text-white px-6 py-5 shadow-md">
        <h1 className="text-2xl font-bold">{t("nav.dashboard")}</h1>
        <p className="text-sm text-blue-100 mt-1">
          Overview of groundwater predictions · Tanzania
        </p>
      </div>

      {/* Stats */}
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#D6E4F5] p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-[#0F4C8A] mb-4">Monthly trends</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8F0FA" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="predictions" stroke="#135AAD" strokeWidth={2.5} />
              <Line type="monotone" dataKey="success" stroke="#059669" strokeWidth={2.5} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-[#D6E4F5] p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-[#0F4C8A] mb-4">Weekly activity</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8F0FA" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
              <Tooltip />
              <Bar dataKey="value" fill="#135AAD" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Notifications list */}
      <div className="bg-white rounded-2xl border border-[#D6E4F5] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E8F0FA] bg-[#F3F7FC]">
          <h3 className="text-sm font-semibold text-[#0F4C8A]">Recent notifications</h3>
        </div>
        {items.length === 0 ? (
          <p className="p-5 text-sm text-slate-400">
            No notifications. Run a prediction to see one here.
          </p>
        ) : (
          <ul className="divide-y divide-[#E8F0FA]">
            {items.slice(0, 5).map((n) => (
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