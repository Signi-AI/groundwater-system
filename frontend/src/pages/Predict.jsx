import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNotifications } from "../context/NotificationContext";
import { api } from "../services/api";

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
  const [error, setError] = useState("");

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
    } catch (e) {}
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const data = await api.createPrediction({
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        resistivity: form.resistivity ? parseFloat(form.resistivity) : null,
        elevation: form.elevation ? parseFloat(form.elevation) : null,
        rainfall: form.rainfall ? parseFloat(form.rainfall) : null,
        rock_type: form.rockType || null,
      });

      setResult({
        potential: data.water_potential || data.potential || "HIGH",
        depth: data.depth || data.expected_depth || "—",
        formation: data.formation || data.rock_type || "—",
        aquifer: data.aquifer_potential || data.aquifer || "—",
        yield: data.expected_yield || data.yield || "—",
        quality: data.water_quality || data.quality || "—",
        ph: data.ph_range || data.ph || "—",
        salinity: data.salinity || "—",
        confidence: data.confidence || 80,
        recommendation: data.recommendation || "See detailed report",
        region: form.region || "—",
      });

      addNotification(
        "Prediction complete",
        "Saved · " + (form.region || "site")
      );
    } catch (err) {
      setError(err.message || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setResult(null);
    setError("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          {t("predict.title")}
        </h1>
        <p className="text-sm text-slate-500">{t("predict.subtitle")}</p>
      </div>

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h2 className="text-sm font-semibold mb-4">Site Data</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Region (Mkoa)</label>
              <input
                name="region"
                value={form.region}
                onChange={handleChange}
                placeholder="From Map page or type manually"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t("predict.latitude")}</label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={form.latitude}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t("predict.longitude")}</label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={form.longitude}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t("predict.resistivity")}</label>
              <input
                type="number"
                name="resistivity"
                value={form.resistivity}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t("predict.rockType")}</label>
              <select
                name="rockType"
                value={form.rockType}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
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
                <label className="block text-xs text-slate-500 mb-1">{t("predict.elevation")}</label>
                <input
                  type="number"
                  name="elevation"
                  value={form.elevation}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t("predict.rainfall")}</label>
                <input
                  type="number"
                  name="rainfall"
                  value={form.rainfall}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-xl text-sm disabled:opacity-60"
              >
                {loading ? t("common.loading") : t("predict.submit")}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm"
              >
                {t("predict.reset")}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {result ? (
            <>
              <div className="bg-[#135AAD] text-white px-6 py-4">
                <p className="text-xs text-blue-100 uppercase">Groundwater Assessment</p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-lg font-semibold">Water Potential</p>
                  <span className="bg-emerald-500 px-3 py-1 rounded-full text-sm font-bold">
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
                  ["Water Quality", result.quality],
                  ["pH", result.ph],
                  ["Salinity", result.salinity],
                ].map(function (row) {
                  return (
                    <div
                      key={row[0]}
                      className="flex justify-between text-sm border-b border-slate-50 pb-2"
                    >
                      <span className="text-slate-500">{row[0]}</span>
                      <span className="font-semibold">{row[1]}</span>
                    </div>
                  );
                })}
                <div className="pt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Confidence</span>
                    <span className="font-semibold">{result.confidence}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div
                      className="bg-emerald-500 h-2.5 rounded-full"
                      style={{ width: result.confidence + "%" }}
                    />
                  </div>
                </div>
                <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-xs text-emerald-700 font-medium uppercase">Recommendation</p>
                  <p className="text-sm text-emerald-800 mt-0.5">{result.recommendation}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[420px] text-center p-8">
              <div className="text-3xl mb-3">💧</div>
              <p className="text-slate-400 text-sm">
                Fill the form and submit to get results from the API
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}