from pathlib import Path

import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBRegressor


# =========================
# PATHS
# =========================

BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = Path(
    r"C:\Users\hp\OneDrive\Tanzania_Water_Quality_All_Regions.xlsx"
)

MODEL_DIR = BASE_DIR / "model"
MODEL_DIR.mkdir(exist_ok=True)


# =========================
# LOAD DATA
# =========================

print("Loading dataset...")

df = pd.read_excel(
    DATA_FILE,
    sheet_name="RAW DATA TANZANIA"
)

print("Original shape:", df.shape)


# =========================
# REMOVE DUPLICATES
# =========================

duplicates = df.duplicated().sum()
print("Duplicates:", duplicates)

if duplicates > 0:
    df = df.drop_duplicates()

print("Shape after duplicate check:", df.shape)


# =========================
# CLEAN DATA
# =========================

cols_to_drop = [
    "S/N",
    "Unnamed: 1",
    "Unnamed: 2",
    "Coordinates_Lat",
    "Coordinates_Lon",
    "NAME",
]

df_clean = df.drop(
    columns=cols_to_drop,
    errors="ignore"
)


# =========================
# ENCODE REGION
# =========================

print("\nEncoding regions...")

le = LabelEncoder()

df_clean["Region_Encoded"] = le.fit_transform(
    df_clean["Region/Zone"]
)

region_mapping = dict(
    zip(
        le.classes_,
        le.transform(le.classes_)
    )
)

print("Region mapping:")
print(region_mapping)


# Remove original categorical column
df_clean = df_clean.drop(
    columns=["Region/Zone"]
)


# =========================
# FEATURES AND TARGETS
# =========================

feature_cols = [
    "NITRATE (PPM)",
    "FLUORIDE (PPM)",
    "CALCIUM Ca2+(mg/L)",
    "MAGNESIUM Mg2+(mg/L)",
    "(HCO3-) (mg/L)",
    "TDS (PPM)",
    "TURBIDITY (NTU)",
    "Region_Encoded",
]

target_cols = [
    "PH",
    "TOTAL HARDNESS (mg/L)",
    "CONDUCTIVITY (µS/cm)",
]


X = df_clean[feature_cols]
y = df_clean[target_cols]


print("\nFeatures:")
print(feature_cols)

print("\nTargets:")
print(target_cols)

print("\nX shape:", X.shape)
print("y shape:", y.shape)

print("\nMissing values:")
print(X.isnull().sum())
print(y.isnull().sum())


# =========================
# REMOVE ROWS WITH MISSING VALUES
# =========================

valid = X.notnull().all(axis=1) & y.notnull().all(axis=1)

X = X.loc[valid].reset_index(drop=True)
y = y.loc[valid].reset_index(drop=True)

print("\nShape after removing missing rows:")
print("X:", X.shape)
print("y:", y.shape)


# =========================
# TRAIN / TEST SPLIT
# =========================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

print("\nTrain size:", X_train.shape[0])
print("Test size:", X_test.shape[0])


# =========================
# TRAIN MODEL
# =========================

print("\nTraining XGBoost model...")

model = XGBRegressor(
    n_estimators=300,
    learning_rate=0.05,
    max_depth=6,
    random_state=42
)

model.fit(
    X_train,
    y_train
)

print("Training completed.")


# =========================
# SAVE MODEL
# =========================

model_path = MODEL_DIR / "tanzania_water_rf_model.pkl"
features_path = MODEL_DIR / "feature_columns.pkl"
encoder_path = MODEL_DIR / "region_label_encoder.pkl"


joblib.dump(model, model_path)
joblib.dump(feature_cols, features_path)
joblib.dump(le, encoder_path)


print("\nFiles saved:")

print(model_path)
print(features_path)
print(encoder_path)


# =========================
# TEST MODEL
# =========================

predictions = model.predict(X_test)

print("\nPrediction test successful.")

print("First prediction:")
print(predictions[0])

print("\nActual value:")
print(y_test.iloc[0].values)

print("\nDONE.")