import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNotifications } from "../context/NotificationContext";

export default function Settings() {
  const { t } = useTranslation();
  const { pushEnabled, setPushEnabled } = useNotifications();
  const [email, setEmail] = useState(true);
  const [autoSave, setAutoSave] = useState(false);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{t("nav.settings")}</h1>
        <p className="text-sm text-slate-500">Manage preferences</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-white">Profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Full Name</label>
            <input
              defaultValue="John Doe"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#135AAD]/30"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Email</label>
            <input
              defaultValue="john@example.com"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#135AAD]/30"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-white">Notifications</h2>

        {/* Connected to Dashboard bell */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-700 dark:text-slate-200">Push notifications</p>
            <p className="text-xs text-slate-400">Get notified after each prediction</p>
          </div>
          <button
            onClick={() => setPushEnabled(!pushEnabled)}
            className={`w-11 h-6 rounded-full transition relative ${
              pushEnabled ? "bg-[#135AAD]" : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition ${
                pushEnabled ? "left-5" : "left-0.5"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-700">Email alerts</span>
          <button
            onClick={() => setEmail(!email)}
            className={`w-11 h-6 rounded-full relative ${email ? "bg-[#135AAD]" : "bg-slate-300"}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow ${email ? "left-5" : "left-0.5"}`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-700">Auto-save reports</span>
          <button
            onClick={() => setAutoSave(!autoSave)}
            className={`w-11 h-6 rounded-full relative ${autoSave ? "bg-[#135AAD]" : "bg-slate-300"}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow ${autoSave ? "left-5" : "left-0.5"}`} />
          </button>
        </div>
      </div>
    </div>
  );
}