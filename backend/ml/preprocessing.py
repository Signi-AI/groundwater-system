from __future__ import annotations

from collections.abc import Mapping

import pandas as pd


def transform_features(features: Mapping[str, object], label_encoders=None) -> pd.DataFrame:
    """Convert one API payload to the tabular format expected by a model."""
    if not isinstance(features, Mapping):
        raise TypeError("features must be a mapping")

    frame = pd.DataFrame([dict(features)])
    encoders = label_encoders or {}
    for column, encoder in encoders.items():
        if column not in frame:
            raise ValueError(f"Missing model feature: {column}")
        frame[column] = encoder.transform(frame[column].astype(str))

    return frame