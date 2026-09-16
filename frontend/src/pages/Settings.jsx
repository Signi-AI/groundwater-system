import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";
import { useNotifications } from "../context/NotificationContext";
import { api, clearToken } from "../services/api";
import { useNavigate } from "react-router-dom";

function loadPref(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    if (v === null) return fallback;
    return JSON.parse(v);
  } catch {
    return fallback;
  }
}

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { dark, toggle } = useTheme();
  const { pushEnabled, setPushEnabled, clearAll } = useNotifications();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");

  const [emailNotif, setEmailNotif] = useState(() => loadPref("pref_email_notif", true));
  const [autoSave, setAutoSave] = useState(() => loadPref("pref_auto_save", true));

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwOk, setPwOk] = useState("");

  const isSw = i18n.language && i18n.language.startsWith("sw");

  useEffect(() => {
    setLoading(true);
    api
      .getProfile()
      .then(setProfile)
      .catch((e) => setError(e.message || "Could not load profile"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    localStorage.setItem("pref_email_notif", JSON.stringify(emailNotif));
  }, [emailNotif]);

  useEffect(() => {
    localStorage.setItem("pref_auto_save", JSON.stringify(autoSave));
  }, [autoSave]);

  const toggleLang = () => {
    i18n.changeLanguage(isSw ? "en" : "sw");
    setOkMsg(isSw ? "Language: English" : "Lugha: Kiswahili");
  };

  const onChangePassword = async (e) => {
    e.preventDefault();
    setPwError("");
    setPwOk("");
    if (newPassword.length < 6) {
      setPwError("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("Passwords do not match");
      return;
    }
    setPwLoading(true);
    try {
      await api.changePassword(currentPassword, newPassword);
      setPwOk("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPwError(err.message || "Could not change password");
    } finally {
      setPwLoading(false);
    }
  };

  const logout = () => {
    clearToken();
    navigate("/login");
  };

  const Toggle = ({ on, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-11 h-6 rounded-full transition ${
        on ? "bg-[#135AAD]" : "bg-slate-300"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition ${
          on ? "translate-x-5" : ""
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          {t("nav.settings")}
        </h1>
        <p className="text-sm text-slate-500">Account, preferences, and security</p>
      </div>

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {error}
        </div>
      )}
      {okMsg && (
        <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
          {okMsg}
        </div>
      )}

      {/* Profile — real name + email */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[#D6E4F5] p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-[#0F4C8A] mb-4">Profile</h2>
        {loading ? (
          <p className="text-sm text-slate-400">Loading profile…</p>
        ) : profile ? (
          <div className="space-y-3">
            <div>
              <p className="text-xs text-slate-400 uppercase">Full name</p>
              <p className="text-base font-semibold text-slate-800 dark:text-white">
                {profile.full_name || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase">Email</p>
              <p className="text-base font-medium text-slate-700 dark:text-slate-200">
                {profile.email}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase">Role</p>
              <span className="inline-block mt-1 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-[#135AAD]">
                {profile.role || "user"}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-400">Profile not available</p>
        )}
      </div>

      {/* Preferences — real toggles */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[#D6E4F5] p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-[#0F4C8A]">Preferences</h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Dark mode</p>
            <p className="text-xs text-slate-400">Switch app theme</p>
          </div>
          <Toggle on={!!dark} onClick={toggle} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Language</p>
            <p className="text-xs text-slate-400">{isSw ? "Kiswahili" : "English"}</p>
          </div>
          <button
            type="button"
            onClick={toggleLang}
            className="text-xs px-3 py-1.5 rounded-full border border-slate-200 font-semibold hover:bg-slate-50"
          >
            {isSw ? "SW → EN" : "EN → SW"}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Push notifications</p>
            <p className="text-xs text-slate-400">Show bell alerts after prediction</p>
          </div>
          <Toggle
            on={!!pushEnabled}
            onClick={() => setPushEnabled && setPushEnabled(!pushEnabled)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Email notifications</p>
            <p className="text-xs text-slate-400">Preference saved on this device</p>
          </div>
          <Toggle on={emailNotif} onClick={() => setEmailNotif(!emailNotif)} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Auto-save forms</p>
            <p className="text-xs text-slate-400">Keep draft inputs locally</p>
          </div>
          <Toggle on={autoSave} onClick={() => setAutoSave(!autoSave)} />
        </div>
      </div>

      {/* Change password — real API */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[#D6E4F5] p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-[#0F4C8A] mb-4">Change password</h2>
        {pwError && (
          <div className="mb-3 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{pwError}</div>
        )}
        {pwOk && (
          <div className="mb-3 text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">{pwOk}</div>
        )}
        <form onSubmit={onChangePassword} className="space-y-3">
          <input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
          />
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
          />
          <button
            type="submit"
            disabled={pwLoading}
            className="px-4 py-2 rounded-xl bg-[#135AAD] text-white text-sm font-medium disabled:opacity-60"
          >
            {pwLoading ? "Saving…" : "Update password"}
          </button>
        </form>
      </div>

      {/* Actions */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[#D6E4F5] p-5 shadow-sm space-y-3">
        <h2 className="text-sm font-semibold text-[#0F4C8A]">Actions</h2>
        <button
          type="button"
          onClick={() => {
            clearAll && clearAll();
            setOkMsg("Notifications cleared");
          }}
          className="w-full text-left text-sm px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50"
        >
          Clear all notifications
        </button>
        <button
          type="button"
          onClick={logout}
          className="w-full text-left text-sm px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50"
        >
          Log out
        </button>
      </div>
    </div>
  );
}