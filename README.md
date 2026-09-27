# AI-Powered Groundwater Prediction System / Mfumo wa AI wa Kubashiri Maji Ardhini

**English** | **Kiswahili**

---

## Overview / Muhtasari

**English**  
This is a full-stack machine learning system that predicts groundwater availability, recommended drilling depth, expected yield, and water quality risks. It is designed to support well drillers (wachimba visima) in Tanzania by reducing the risk of dry boreholes.

**Kiswahili**  
Huu ni mfumo kamili wa Machine Learning unaotabiri uwepo wa maji ardhini, kina kinachopendekezwa cha kuchimba, kiasi cha maji (yield), na hatari za ubora wa maji. Umefanywa kuwasaidia wachimba visima nchini Tanzania kupunguza hatari ya visima vikavu.

---

## Tech Stack

| Layer          | Technology                          |
|----------------|-------------------------------------|
| Frontend       | React.js + Tailwind CSS + i18n      |
| Backend        | FastAPI + SQLAlchemy + JWT          |
| Machine Learning | XGBoost + Pandas + Scikit-learn  |
| Database       | PostgreSQL (or SQLite for dev)      |
| Languages      | English + Kiswahili (bilingual UI)  |

---

## Project Structure / Muundo wa Project

```
groundwater-prediction-system/
├── frontend/                     # React + Tailwind + i18n (Sw/Eng)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── i18n/                 # Translation files
│   │   │   ├── en.json
│   │   │   └── sw.json
│   │   └── assets/
│   └── package.json
│
├── backend/                      # FastAPI application
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   ├── ml/
│   │   ├── model/                # Saved XGBoost model
│   │   ├── data/
│   │   ├── preprocessing.py
│   │   └── train.py
│   ├── requirements.txt
│   └── .env.example
│
├── data/                         # Datasets
├── notebooks/                    # Exploration & training
├── docs/                         # Documentation
└── README.md
```

---

## Features / Vipengele

- Bilingual interface (English / Kiswahili)
- User registration & login (JWT)
- Groundwater prediction (water presence, depth, yield, quality risk)
- Interactive dashboard & charts
- Prediction history
- Admin panel
- Responsive design

---

## How to Run / Jinsi ya Kuendesha

### 1. Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env              # Edit .env with your settings
alembic upgrade head
uvicorn app.main:app --reload
```

Alembic migrations are stored in `backend/migrations`. Run migration commands
from the `backend` directory so the application settings and models load
correctly.

### 2. Frontend
```bash
cd frontend
npm install
npm start
```

Frontend → http://localhost:3000  
Backend  → http://localhost:8000

---

## Language Switching / Kubadilisha Lugha

The system supports **English** and **Kiswahili**.  
Users can switch language from the navbar.  
Translation files are located in `frontend/src/i18n/`.

---

## Team Roles / Majukumu

- **Frontend** → React + Tailwind + i18n
- **Backend**  → FastAPI + Database + Auth
- **ML**       → Data preprocessing, XGBoost training & evaluation

# Groundwater and Water Quality Prediction System

## Project Overview

This project uses Machine Learning to predict groundwater and water quality parameters from available water quality data.

The project focuses on predicting important parameters such as pH, nitrate, total hardness, TDS, and conductivity.

The Machine Learning model is developed and tested using Google Colab.

## Machine Learning Notebook

The main notebook is:

`model_prediction.ipynb`

## How to Run

1. Open `model_prediction.ipynb` in Google Colab.
2. Upload the required dataset.
3. Install the required Python libraries.
4. Run the notebook cells from the beginning to the end.
5. The notebook performs data preprocessing, model training, evaluation, and prediction.

## Data

The dataset contains groundwater and water quality parameters such as:

- Nitrate
- Fluoride
- Calcium
- Magnesium
- Bicarbonate
- TDS
- Turbidity
- pH
- Conductivity
- Total Hardness
- Region

## Model Evaluation

The models are evaluated using:

- R² Score
- RMSE
- MAE

## Future Development

Future development will include:

- Rock type prediction
- Rock depth estimation
- Drilling difficulty estimation
- Water quality classification
- Water suitability recommendations
- Web-based prediction interface

- **Admin**    → Coordination & testing

---

## License
Academic / Research project.
