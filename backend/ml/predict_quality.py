from pathlib import Path
import joblib
import pandas as pd

MODEL_DIR = Path(__file__).resolve().parent / "model"

_model = None
_features = None
_region_le = None

def load_quality():
    global _model, _features, _region_le
    if _model is None:
        _model = joblib.load(MODEL_DIR / "tanzania_water_rf_model.pkl")
        _features = joblib.load(MODEL_DIR / "feature_columns.pkl")
        _region_le = joblib.load(MODEL_DIR / "region_label_encoder.pkl")

def encode_region(region_name: str) -> int:
    load_quality()
    name = (region_name or "").strip().upper().replace(" ", "-")
    classes = list(_region_le.classes_)
    for c in classes:
        cu = str(c).upper()
        if name == cu or name in cu or cu.startswith(name) or name.replace("-ZONE", "") in cu:
            return int(_region_le.transform([c])[0])
    # try append -ZONE
    for c in classes:
        if name.replace("-ZONE", "") in str(c).upper():
            return int(_region_le.transform([c])[0])
    return 0

def get_ph_recommendation(ph: float) -> dict:
    if ph < 6.5:
        return {
            "category": "ACIDIC",
            "status": "Caution",
            "recommendation": "Acidic water — monitor corrosion and taste",
        }
    if ph <= 8.5:
        return {
            "category": "ACCEPTABLE",
            "status": "Good",
            "recommendation": "pH in acceptable drinking range (approx 6.5–8.5)",
        }
    return {
        "category": "ALKALINE",
        "status": "Monitor",
        "recommendation": "Higher pH — may taste bitter/soapy",
    }

def predict_water_quality(
    nitrate: float = 10,
    fluoride: float = 1.0,
    calcium: float = 50,
    magnesium: float = 20,
    hco3: float = 100,
    tds: float = 500,
    turbidity: float = 5,
    region: str = "DODOMA-ZONE",
) -> dict:
    load_quality()
    row = {
        "NITRATE (PPM)": float(nitrate),
        "FLUORIDE (PPM)": float(fluoride),
        "CALCIUM Ca2+(mg/L)": float(calcium),
        "MAGNESIUM Mg2+(mg/L)": float(magnesium),
        "(HCO3-) (mg/L)": float(hco3),
        "TDS (PPM)": float(tds),
        "TURBIDITY (NTU)": float(turbidity),
        "Region_Encoded": encode_region(region),
    }
    X = pd.DataFrame([row], columns=_features)
    pred = _model.predict(X)[0]
    ph = float(pred[0])
    hardness = float(pred[1])
    conductivity = float(pred[2])
    ph_info = get_ph_recommendation(ph)

    if conductivity < 500:
        salinity = "LOW"
    elif conductivity < 1500:
        salinity = "MEDIUM"
    else:
        salinity = "HIGH"

    return {
        "ph": round(ph, 2),
        "total_hardness": round(hardness, 2),
        "conductivity": round(conductivity, 2),
        "ph_category": ph_info["category"],
        "water_quality": ph_info["status"],
        "recommendation": ph_info["recommendation"],
        "salinity": salinity,
    }