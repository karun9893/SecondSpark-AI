from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import sys
import os

# Define base directory (backend root)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

from utils.recommendation import get_recommendation

app = FastAPI(
    title="SecondSpark AI API",
    version="1.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================
# LOAD MODELS
# ==========================

soh_model_path = os.path.join(BASE_DIR, "models", "soh_model.pkl")
rul_model_path = os.path.join(BASE_DIR, "models", "rul_model.pkl")

soh_model = joblib.load(soh_model_path)
rul_model = joblib.load(rul_model_path)


# ==========================
# INPUT SCHEMA
# ==========================

class BatteryInput(BaseModel):
    IR: float
    QCharge: float
    QDischarge: float
    Tavg: float
    Tmax: float
    Tmin: float
    chargetime: float
    cycle: float


# ==========================
# HEALTH CHECK
# ==========================

@app.get("/")
def root():
    return {
        "message": "SecondSpark AI API Running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# ==========================
# PREDICT
# ==========================

@app.post("/predict")
def predict(data: BatteryInput):

    df = pd.DataFrame([data.dict()])

    soh = float(
        soh_model.predict(df)[0]
    )

    rul = float(
    rul_model.predict(df)[0]
   )

    rul = max(0, rul)

    recommendation = get_recommendation(
        soh,
        rul
    )

    if soh >= 90:
        grade = "A"
        health_status = "Excellent"

    elif soh >= 80:
        grade = "B"
        health_status = "Good"

    elif soh >= 70:
        grade = "C"
        health_status = "Moderate"

    else:
        grade = "D"
        health_status = "Poor"

    return {
        "soh": round(soh, 2),
        "rul": round(rul, 0),
        "grade": grade,
        "health_status": health_status,
        "recommendation": recommendation
    }