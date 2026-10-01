from pathlib import Path
import joblib
import pandas as pd

MODEL_DIR = Path(__file__).resolve().parent / "model"

_depth = None
_rock = None
_rock_features = None
_rock_names = None

def geology_available() -> bool:
    return (MODEL_DIR / "depth_model.pkl").exists() and (
        MODEL_DIR / "rock_type_model.pkl"
    ).exists()

def load_geology():
    global _depth, _rock, _rock_features, _rock_names
    if _depth is None and geology_available():
        _depth = joblib.load(MODEL_DIR / "depth_model.pkl")
        _rock = joblib.load(MODEL_DIR / "rock_type_model.pkl")
        _rock_features = joblib.load(MODEL_DIR / "rock_type_features.pkl")
        _rock_names = joblib.load(MODEL_DIR / "rock_names.pkl")

def prepare_rock_input(data: pd.DataFrame) -> pd.DataFrame:
    data_fe = data.copy().sort_values(["WELL", "DEPTH_MD"]).reset_index(drop=True)
    for col in ["GR", "RHOB", "NPHI", "DTC", "CALI", "SP"]:
        if col in data_fe.columns:
            data_fe[f"{col}_diff"] = data_fe.groupby("WELL")[col].diff()
    for col in ["GR", "RHOB", "NPHI", "DTC"]:
        if col in data_fe.columns:
            g = data_fe.groupby("WELL")[col]
            data_fe[f"{col}_roll_mean"] = g.transform(
                lambda s: s.rolling(5, min_periods=1, center=True).mean()
            )
            data_fe[f"{col}_roll_std"] = g.transform(
                lambda s: s.rolling(5, min_periods=2, center=True).std()
            )
    data_fe = data_fe.fillna(0)
    return data_fe[_rock_features]

def predict_geology(depth_input: dict | None = None, sensor_rows: list | None = None) -> dict:
    if not geology_available():
        return {
            "depth": None,
            "expected_depth": None,
            "rock_type": None,
            "formation": None,
            "geology_available": False,
        }
    load_geology()
    out = {"geology_available": True, "depth": None, "rock_type": None, "formation": None}

    if depth_input:
        feats = list(_depth.feature_names_in_)
        df = pd.DataFrame([depth_input])
        for f in feats:
            if f not in df.columns:
                df[f] = 0
        pred = float(_depth.predict(df[feats])[0])
        out["depth"] = round(pred, 2)
        out["expected_depth"] = f"{int(pred - 5)} – {int(pred + 10)} metres"

    if sensor_rows:
        X = prepare_rock_input(pd.DataFrame(sensor_rows))
        code = _rock.predict(X)[-1]
        name = _rock_names.get(code, str(code)) if isinstance(_rock_names, dict) else str(code)
        out["rock_type"] = name
        out["formation"] = name
        out["rock_code"] = int(code) if hasattr(code, "item") else code

    return out