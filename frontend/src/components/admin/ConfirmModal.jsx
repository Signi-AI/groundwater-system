import React, { useState } from "react";

export default function ConfirmModal({
  open,
  title = "Confirm",
  message,
  confirmLabel = "Confirm",
  danger = false,
  requireText = null, // e.g. "DELETE" for double confirm
  onConfirm,
  onClose,
  loading = false,
}) {
  const [typed, setTyped] = useState("");
  if (!open) return null;

  const canSubmit = !requireText || typed === requireText;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{message}</p>
        {requireText && (
          <div className="mt-4">
            <label className="text-xs text-slate-500">
              Type <span className="font-mono font-bold text-red-600">{requireText}</span> to confirm
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-2 text-sm"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              autoFocus
            />
          </div>
        )}
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm border border-slate-200 dark:border-slate-700"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSubmit || loading}
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50 ${
              danger ? "bg-red-600 hover:bg-red-500" : "bg-blue-600 hover:bg-blue-500"
            }`}
          >
            {loading ? "Please wait…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}