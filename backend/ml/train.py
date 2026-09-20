from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestRegressor


def train_model(dataset_path: str, target_column: str, output_path: str):
    """Train and save a numeric groundwater regression model."""
    data = pd.read_csv(dataset_path)
    if target_column not in data.columns:
        raise ValueError(f"Target column not found: {target_column}")

    cleaned = data.dropna(subset=[target_column]).copy()
    features = cleaned.drop(columns=[target_column]).select_dtypes(include="number")
    if features.empty:
        raise ValueError("Training data must contain numeric feature columns")

    model = RandomForestRegressor(n_estimators=200, random_state=42, n_jobs=-1)
    model.fit(features, cleaned[target_column])
    bundle = {"model": model, "feature_names": list(features.columns)}
    destination = Path(output_path)
    destination.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(bundle, destination)
    return bundle


if __name__ == "__main__":
    raise SystemExit("Call train_model(dataset_path, target_column, output_path) from a training job.")