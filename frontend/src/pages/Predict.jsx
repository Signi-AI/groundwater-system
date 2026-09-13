import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNotifications } from "../context/NotificationContext";

const initialForm = {
  latitude: "",
  longitude: "",
  region: "",
  resistivity: "",
  rockType: "",
  elevation: "",
  rainfall: "",
};

export default function Predict() {
  const { t } = useTranslation();
  const { addNotification } = useNotifications();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Soma location + mkoa kutoka Map page
  useEffect(() => {
    try {
      const raw = localStorage.getItem("geo_location");
      if (raw) {
        const g = JSON.parse(raw);
        setForm((f) => ({
          ...f,
          latitude: g.lat != null ? String(g.lat) : f.latitude,
          longitude: g.lng != null ? String(g.lng) : f.longitude,
          region: g.region || f.region || "",
        }));
      }
    } catch (_) {
      // ignore bad localStorage
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    setTimeout(() => {
      const prediction = {
        potential: "HIGH",
        depth: "45 – 60 metres",
        formation: "Fractured Basement Rock",
        aquifer: "GOOD",
        yield: "MEDIUM – HIGH",
        quality: "GOOD",
        ph: "7.1 – 7.5",
        salinity: "LOW",
        confidence: 86,
        recommendation: "Suitable for further drilling",
        region: form.region || "—",
      };

      setResult(prediction);

      addNotification(
        "Prediction complete",
        `Region: ${form.region || "N/A"} · (${form.latitude || "—"}, ${form.longitude || "—"}) · Potential ${prediction.potential}`
      );

      setLoading(false);
    }, 1500);
  };

  const handleReset = () => {
    setForm(initialForm);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          {t("predict.title")}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t("predict.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">
            Site Data
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Region (mkoa) — from Map or manual */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Region (Mkoa)
              </label>
              <input
                type="text"
                name="region"
                value={form.region}
                onChange={handleChange}
                placeholder="e.g. Dodoma — use Map page to auto-fill"
                className="w-full border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#135AAD]/30 bg-slate-50"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Open <strong>Map</strong> → Use my location to auto-detect mkoa
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {t("predict.latitude")}
                </label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={form.latitude}
                  onChange={handleChange}
                  placeholder="-6.1630"
                  required
                  className="w-full border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#135AAD]/30 bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {t("predict.longitude")}
                </label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={form.longitude}
                  onChange={handleChange}
                  placeholder="35.7516"
                  required
                  className="w-full border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#135AAD]/30 bg-slate-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                {t("predict.resistivity")}
              </label>
              <input
                type="number"
                name="resistivity"
                value={form.resistivity}
                onChange={handleChange}
                placeholder="245.6"
                className="w-full border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#135AAD]/30 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                {t("predict.rockType")}
              </label>
              <select
                name="rockType"
                value={form.rockType}
                onChange={handleChange}
                className="w-full border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#135AAD]/30 bg-slate-50"
              >
                <option value="">Select type</option>
                <option value="basement">Basement / Fractured</option>
                <option value="alluvial">Alluvial</option>
                <option value="sedimentary">Sedimentary</option>
                <option value="volcanic">Volcanic</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {t("predict.elevation")}
                </label>
                <input
                  type="number"
                  name="elevation"
                  value={form.elevation}
                  onChange={handleChange}
                  placeholder="1120"
                  className="w-full border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#135AAD]/30 bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {t("predict.rainfall")}
                </label>
                <input
                  type="number"
                  name="rainfall"
                  value={form.rainfall}
                  onChange={handleChange}
                  placeholder="850"
                  className="w-full border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#135AAD]/30 bg-slate-50"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-xl text-sm transition disabled:opacity-60"
              >
                {loading ? t("common.loading") : t("predict.submit")}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50"
              >
                {t("predict.reset")}
              </button>
            </div>
          </form>

          {loading && (
            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-sm font-medium text-[#135AAD] mb-2">GROUNDWATER SCAN</p>
              <div className="space-y-1 text-xs text-slate-500 mb-3">
                <p>GPS ................ ✓</p>
                <p>Region ............. ✓</p>
                <p>Location ........... ✓</p>
                <p>Environmental data . ✓</p>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-[#135AAD] h-2 rounded-full animate-pulse" style={{ width: "75%" }} />
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          {result ? (
            <>
              <div className="bg-[#135AAD] text-white px-6 py-4">
                <p className="text-xs uppercase tracking-wider text-blue-100">
                  Groundwater Assessment
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-lg font-semibold">Water Potential</p>
                  <span className="bg-emerald-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    {result.potential}
                  </span>
                </div>
                {result.region && result.region !== "—" && (
                  <p className="text-xs text-blue-100 mt-1">Region: {result.region}</p>
                )}
              </div>
              <div className="p-6 space-y-3">
                {[
                  ["Expected Depth", result.depth],
                  ["Geological Formation", result.formation],
                  ["Aquifer Potential", result.aquifer],
                  ["Expected Yield", result.yield],
                  ["Predicted Water Quality", result.quality],
                  ["pH", result.ph],
                  ["Salinity", result.salinity],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex justify-between text-sm border-b border-slate-50 dark:border-slate-800 pb-2"
                  >
                    <span className="text-slate-500">{label}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {value}
                    </span>
                  </div>
                ))}
                <div className="pt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Confidence</span>
                    <span className="font-semibold">{result.confidence}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div
                      className="bg-emerald-500 h-2.5 rounded-full"
                      style={{ width: `${result.confidence}%` }}
                    />
                  </div>
                </div>
                <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-xs text-emerald-700 font-medium uppercase">
                    Recommendation
                  </p>
                  <p className="text-sm text-emerald-800 mt-0.5">
                    {result.recommendation}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[420px] text-center p-8">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-2xl mb-4">
                💧
              </div>
              <p className="text-slate-400 text-sm">
                Fill the form and click <strong>{t("predict.submit")}</strong>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}