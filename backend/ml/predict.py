from __future__ import annotations

from collections.abc import Mapping
from typing import Any

from .preprocessing import transform_features


def predict_one(model_bundle: Any, features: Mapping[str, object]) -> dict:
    """Predict one row from either a saved estimator or a model bundle."""
    if isinstance(model_bundle, Mapping):
        model = model_bundle.get("model")
        feature_names = model_bundle.get("feature_names")
        label_encoders = model_bundle.get("label_encoders")
    else:
        model = model_bundle
        feature_names = getattr(model, "feature_names_in_", None)
        label_encoders = None

    if model is None or not hasattr(model, "predict"):
        raise ValueError("The loaded model must provide a predict method")

    frame = transform_features(features, label_encoders)
    if feature_names is not None:
        missing = [name for name in feature_names if name not in frame.columns]
        if missing:
            raise ValueError(f"Missing model features: {', '.join(missing)}")
        frame = frame[list(feature_names)]

    prediction = model.predict(frame)[0]
    if isinstance(prediction, Mapping):
        return dict(prediction)
    return {"prediction": prediction.item() if hasattr(prediction, "item") else prediction}