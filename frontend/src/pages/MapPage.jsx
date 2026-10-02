import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const TZ_CENTER = [-6.369, 34.8888];
const TZ_ZOOM = 6;

function FlyTo({ lat, lng, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (lat != null && lng != null) {
      map.flyTo([lat, lng], zoom, { duration: 1.1 });
    }
  }, [lat, lng, zoom, map]);
  return null;
}

async function reverseGeocode(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "GroundwaterPredictionSystem/1.0 (Tanzania)",
    },
  });
  if (!res.ok) return null;
  const data = await res.json();
  const a = data.address || {};
  return {
    region: a.state || a.region || a.county || a.city || "—",
    place: a.town || a.village || a.suburb || a.hamlet || a.city || "",
    display: data.display_name || "",
  };
}

export default function MapPage() {
  const { t } = useTranslation();
  const [position, setPosition] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [regionInfo, setRegionInfo] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [mapType, setMapType] = useState("street");
  const watchRef = useRef(null);

  // Funga sidebar (simu) — epuka overlay juu ya ramani
  useEffect(() => {
    window.dispatchEvent(new Event("close-sidebar"));
  }, []);

  const stopWatch = () => {
    if (watchRef.current != null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchRef.current);
      watchRef.current = null;
    }
  };

  useEffect(() => () => stopWatch(), []);

  const saveAndShow = async (lat, lng, acc) => {
    setPosition({ lat, lng });
    setAccuracy(acc);

    const info = await reverseGeocode(lat, lng);
    setRegionInfo(
      info || {
        region: "—",
        place: "",
        display: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      }
    );

    localStorage.setItem(
      "geo_location",
      JSON.stringify({
        lat,
        lng,
        accuracy: acc,
        region: info?.region || "",
        place: info?.place || "",
        updatedAt: Date.now(),
      })
    );
    setStatus("ok");
  };

  const locateMe = () => {
    if (!navigator.geolocation) {
      setError("This browser does not support location");
      return;
    }

    stopWatch();
    setStatus("loading");
    setError("");
    setPosition(null);
    setRegionInfo(null);
    setAccuracy(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng, accuracy: acc } = pos.coords;
        saveAndShow(lat, lng, acc);

        let best = acc;
        watchRef.current = navigator.geolocation.watchPosition(
          (p) => {
            const a = p.coords.accuracy;
            if (a != null && (best == null || a < best)) {
              best = a;
              saveAndShow(p.coords.latitude, p.coords.longitude, a);
            }
          },
          () => {},
          { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
        );
        setTimeout(stopWatch, 12000);
      },
      (err) => {
        setStatus("error");
        setPosition(null);
        if (err.code === 1) {
          setError("Allow location permission, then press Use my location again.");
        } else if (err.code === 2) {
          setError("Device location unavailable. Turn ON Location/GPS and try again.");
        } else {
          setError("Timeout. Turn on GPS and try again.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 25000,
        maximumAge: 0,
      }
    );
  };

  const streetUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const satelliteUrl =
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

  return (
    <div className="space-y-4 flex flex-col min-h-[70vh] relative z-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            {t("nav.map")}
          </h1>
          <p className="text-sm text-slate-500">
            Shows only the current user location when you press the button
          </p>
        </div>
        <div className="flex flex-wrap gap-2 relative z-10">
          <button
            type="button"
            onClick={() => setMapType("street")}
            className={`px-3 py-2 rounded-xl text-xs font-medium border ${
              mapType === "street"
                ? "bg-[#135AAD] text-white border-[#135AAD]"
                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            }`}
          >
            Street
          </button>
          <button
            type="button"
            onClick={() => setMapType("satellite")}
            className={`px-3 py-2 rounded-xl text-xs font-medium border ${
              mapType === "satellite"
                ? "bg-[#135AAD] text-white border-[#135AAD]"
                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            }`}
          >
            Satellite
          </button>
          <button
            type="button"
            onClick={locateMe}
            disabled={status === "loading"}
            className="px-4 py-2 rounded-xl bg-[#135AAD] text-white text-sm font-medium disabled:opacity-60"
          >
            {status === "loading" ? "Reading GPS…" : "Use my location"}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {position && (
        <div className="bg-white dark:bg-slate-900 border border-[#D6E4F5] dark:border-slate-700 rounded-xl px-4 py-3 shadow-sm relative z-10">
          <p className="text-xs uppercase text-slate-400">Current device position</p>
          <p className="text-lg font-semibold text-[#135AAD]">
            {regionInfo?.region || "…"}
          </p>
          {regionInfo?.place && (
            <p className="text-sm text-slate-600 dark:text-slate-300">{regionInfo.place}</p>
          )}
          <p className="text-sm font-mono text-slate-800 dark:text-slate-200 mt-1">
            {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
          </p>
          {accuracy != null && (
            <p className="text-xs text-slate-500 mt-1">
              Accuracy ±{Math.round(accuracy)} m
              {accuracy > 1000
                ? " (weak — device used network location, not true GPS)"
                : ""}
            </p>
          )}
          {regionInfo?.display && (
            <p className="text-[11px] text-slate-400 mt-1">{regionInfo.display}</p>
          )}
        </div>
      )}

      {!position && status === "idle" && (
        <div className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 relative z-10">
          Map shows Tanzania overview only. Press <strong>Use my location</strong> to
          mark where this user is right now.
        </div>
      )}

      {/* relative z-0 — map haifunikiwi na sidebar; si fixed inset-0 */}
      <div className="relative z-0 flex-1 min-h-[480px] rounded-2xl overflow-hidden border border-[#D6E4F5] dark:border-slate-700 shadow-sm isolate">
        <MapContainer
          center={TZ_CENTER}
          zoom={TZ_ZOOM}
          className="h-full w-full"
          style={{ height: "100%", width: "100%", minHeight: 480, zIndex: 0 }}
          scrollWheelZoom
        >
          <TileLayer
            key={mapType}
            attribution={
              mapType === "street" ? "&copy; OpenStreetMap" : "Tiles &copy; Esri"
            }
            url={mapType === "street" ? streetUrl : satelliteUrl}
          />

          {position && (
            <>
              <FlyTo
                lat={position.lat}
                lng={position.lng}
                zoom={accuracy && accuracy > 2000 ? 12 : 16}
              />
              <Marker position={[position.lat, position.lng]}>
                <Popup>
                  Live position of this device
                  <br />
                  {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
                </Popup>
              </Marker>
              {accuracy != null && (
                <Circle
                  center={[position.lat, position.lng]}
                  radius={Math.min(accuracy, 5000)}
                  pathOptions={{
                    color: "#135AAD",
                    fillColor: "#135AAD",
                    fillOpacity: 0.12,
                  }}
                />
              )}
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
}