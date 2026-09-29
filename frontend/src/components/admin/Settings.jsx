import React from "react";
import { Navigate, useOutletContext } from "react-router-dom";
import { can } from "../../utils/roles";

export default function Settings() {
  const { role } = useOutletContext() || {};

  // Only super_admin can open Settings
  if (!can(role, "view_settings")) {
    return <Navigate to="/admin/overview" replace />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          System configuration — super admin only.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          System
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          Maintenance mode, mail/OTP status, and audit log will go here.
        </p>
      </div>
    </div>
  );
}