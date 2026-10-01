import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../services/api";
import { useNotifications } from "../context/NotificationContext";

const inputCls =
  "w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

const labelCls = "block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1";

export default function Predict() {
  const { t } = useTranslation();
  const { addNotification } = useNotifications();

  const [form, setForm] = useState({
    latitude: "",
    longitude: "",
    region: "",
    nitrate: "10",
    fluoride: "1",
    calcium: "50",
    magnesium: "20",
    hco3: "100",
    tds: "500",
    turbidity: "5",
    elevation: "",
    rainfall: "",
    resistivity: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  // Load region / lat / lng from Map page
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
    } catch (_) {}
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const data = await api.createPrediction({
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        region: form.region || null,
        nitrate: parseFloat(form.nitrate) || 10,
        fluoride: parseFloat(form.fluoride) || 1,
        calcium: parseFloat(form.calcium) || 50,
        magnesium: parseFloat(form.magnesium) || 20,
        hco3: parseFloat(form.hco3) || 100,
        tds: parseFloat(form.tds) || 500,
        turbidity: parseFloat(form.turbidity) || 5,
        elevation: form.elevation ? parseFloat(form.elevation) : null,
        rainfall: form.rainfall ? parseFloat(form.rainfall) : null,
        resistivity: form.resistivity ? parseFloat(form.resistivity) : null,
      });

      setResult({
        potential: data.water_potential || data.potential || "—",
        depth: data.expected_depth || data.depth || "—",
        formation: data.formation || data.rock_type || "—",
        aquifer: data.aquifer_potential || "—",
        yield: data.expected_yield || "—",
        quality: data.water_quality || "—",
        ph: data.ph != null ? String(data.ph) : "—",
        salinity: data.salinity || "—",
        hardness: data.total_hardness != null ? String(data.total_hardness) : "—",
        conductivity: data.conductivity != null ? String(data.conductivity) : "—",
        confidence: data.confidence || 80,
        recommendation: data.recommendation || "—",
      });

      if (typeof addNotification === "function") {
        addNotification(
          "Prediction complete",
          `Assessment ready — potential ${data.water_potential || data.potential || "—"}`
        );
      }
    } catch (err) {
      setError(err.message || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          {t("predict.title") || "Groundwater prediction"}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {t("predict.subtitle") || "Enter site and water parameters, then run assessment."}
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6"
      >
        {/* Location */}
        <div>
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">
            Location
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Latitude</label>
              <input
                name="latitude"
                value={form.latitude}
                onChange={onChange}
                className={inputCls}
                placeholder="-6.16"
              />
            </div>
            <div>
              <label className={labelCls}>Longitude</label>
              <input
                name="longitude"
                value={form.longitude}
                onChange={onChange}
                className={inputCls}
                placeholder="35.75"
              />
            </div>
            <div>
              <label className={labelCls}>Region / Zone</label>
              <input
                name="region"
                value={form.region}
                onChange={onChange}
                className={inputCls}
                placeholder="DODOMA-ZONE"
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Tip: open Map → Use my location to auto-fill lat, lng, region.
          </p>
        </div>

        {/* Water quality inputs — HAPA */}
        <div>
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">
            Water quality parameters
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Nitrate (PPM)</label>
              <input
                name="nitrate"
                type="number"
                step="any"
                value={form.nitrate}
                onChange={onChange}
                className={inputCls}
                placeholder="10"
              />
            </div>
            <div>
              <label className={labelCls}>Fluoride (PPM)</label>
              <input
                name="fluoride"
                type="number"
                step="any"
                value={form.fluoride}
                onChange={onChange}
                className={inputCls}
                placeholder="1"
              />
            </div>
            <div>
              <label className={labelCls}>Calcium Ca²⁺ (mg/L)</label>
              <input
                name="calcium"
                type="number"
                step="any"
                value={form.calcium}
                onChange={onChange}
                className={inputCls}
                placeholder="50"
              />
            </div>
            <div>
              <label className={labelCls}>Magnesium Mg²⁺ (mg/L)</label>
              <input
                name="magnesium"
                type="number"
                step="any"
                value={form.magnesium}
                onChange={onChange}
                className={inputCls}
                placeholder="20"
              />
            </div>
            <div>
              <label className={labelCls}>HCO₃⁻ (mg/L)</label>
              <input
                name="hco3"
                type="number"
                step="any"
                value={form.hco3}
                onChange={onChange}
                className={inputCls}
                placeholder="100"
              />
            </div>
            <div>
              <label className={labelCls}>TDS (PPM)</label>
              <input
                name="tds"
                type="number"
                step="any"
                value={form.tds}
                onChange={onChange}
                className={inputCls}
                placeholder="500"
              />
            </div>
            <div>
              <label className={labelCls}>Turbidity (NTU)</label>
              <input
                name="turbidity"
                type="number"
                step="any"
                value={form.turbidity}
                onChange={onChange}
                className={inputCls}
                placeholder="5"
              />
            </div>
          </div>
        </div>

        {/* Optional extra */}
        <div>
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">
            Optional site data
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Elevation (m)</label>
              <input
                name="elevation"
                type="number"
                step="any"
                value={form.elevation}
                onChange={onChange}
                className={inputCls}
                placeholder="1120"
              />
            </div>
            <div>
              <label className={labelCls}>Rainfall (mm)</label>
              <input
                name="rainfall"
                type="number"
                step="any"
                value={form.rainfall}
                onChange={onChange}
                className={inputCls}
                placeholder="850"
              />
            </div>
            <div>
              <label className={labelCls}>Resistivity</label>
              <input
                name="resistivity"
                type="number"
                step="any"
                value={form.resistivity}
                onChange={onChange}
                className={inputCls}
                placeholder="245"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto min-h-[44px] px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 disabled:opacity-60 transition"
        >
          {loading ? "Processing..." : "Run prediction"}
        </button>
      </form>

      {/* Results */}
      {result && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
            Groundwater assessment
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-slate-500 text-xs">Water potential</p>
              <p className="font-bold text-blue-600 text-lg">{result.potential}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs">Expected depth</p>
              <p className="font-semibold">{result.depth}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs">Formation / rock</p>
              <p className="font-semibold">{result.formation}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs">pH</p>
              <p className="font-semibold">{result.ph}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs">Salinity</p>
              <p className="font-semibold">{result.salinity}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs">Water quality</p>
              <p className="font-semibold">{result.quality}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs">Total hardness</p>
              <p className="font-semibold">{result.hardness}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs">Conductivity</p>
              <p className="font-semibold">{result.conductivity}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs">Confidence</p>
              <p className="font-semibold">{result.confidence}%</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-4">
            {result.recommendation}
          </p>
        </div>
      )}
    </div>
  );
}