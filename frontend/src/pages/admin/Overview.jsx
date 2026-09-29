import { Link } from "react-router-dom";

export default function Overview() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">System control</h1>
        <p className="text-sm text-slate-500 mt-1">
          Super Admin — security, users, and platform health. Not for site prediction.
        </p>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <Link
          to="/admin/users"
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:border-blue-500/50 transition"
        >
          <p className="font-semibold">Users & access</p>
          <p className="text-xs text-slate-500 mt-1">Roles, reset password, delete accounts</p>
        </Link>
        <Link
          to="/admin/predictions"
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:border-blue-500/50 transition"
        >
          <p className="font-semibold">All assessments</p>
          <p className="text-xs text-slate-500 mt-1">Audit predictions across Tanzania</p>
        </Link>
        <Link
          to="/admin/settings"
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:border-blue-500/50 transition"
        >
          <p className="font-semibold">System settings</p>
          <p className="text-xs text-slate-500 mt-1">Mail, health, maintenance</p>
        </Link>
      </div>
    </div>
  );
}