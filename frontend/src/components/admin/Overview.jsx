import React, { useEffect, useState } from "react";
import { Users, Droplets, TrendingUp, Activity } from "lucide-react";
import { api } from "../../services/api";

function Card({ title, value, sub, icon: Icon, color = "blue" }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-950/40",
    slate: "bg-slate-100 text-slate-600 dark:bg-slate-800",
  };
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{title}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
          {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
        </div>
        <div className={`p-2.5 rounded-xl ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800 h-28" />
  );
}

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = api?.adminStats ? await api.adminStats() : null;
        setStats(
          data || {
            total_users: "—",
            new_users_7d: "—",
            total_predictions: "—",
            predictions_today: "—",
            health: "unknown",
          }
        );
      } catch (e) {
        setErr(e.message || "Failed to load stats");
        setStats({
          total_users: 0,
          new_users_7d: 0,
          total_predictions: 0,
          predictions_today: 0,
          health: "down",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Overview</h1>
        <p className="text-sm text-slate-500 mt-1">Groundwater system — Tanzania operations</p>
      </div>

      {err && (
        <div className="text-sm text-amber-800 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 rounded-xl px-4 py-3">
          {err} — showing placeholders until API is ready.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading ? (
          <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </>
        ) : (
          <>
            <Card title="Total users" value={stats.total_users} icon={Users} color="blue" />
            <Card title="New users (7d)" value={stats.new_users_7d} icon={TrendingUp} color="green" />
            <Card title="Predictions" value={stats.total_predictions} icon={Droplets} color="amber" />
            <Card
              title="Today"
              value={stats.predictions_today}
              sub="Assessments today"
              icon={Activity}
              color="slate"
            />
          </>
        )}
      </div>

      {/* Chart placeholders — plug Recharts when stats.charts available */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 min-h-[280px]">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Prediction trends</h2>
          <p className="text-xs text-slate-500 mt-1">Weekly / monthly — connect `stats.trend`</p>
          <div className="mt-8 h-40 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400 text-sm">
            Area chart placeholder
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 min-h-[280px]">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Water potential</h2>
          <p className="text-xs text-slate-500 mt-1">HIGH / MEDIUM / LOW</p>
          <div className="mt-8 h-40 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400 text-sm">
            Donut chart placeholder
          </div>
        </div>
      </div>
    </div>
  );
}