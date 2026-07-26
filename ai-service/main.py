from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib

app = FastAPI(
    title="SecondSpark AI",
    description="Battery SOH & RUL Prediction Service",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Models
soh_model = joblib.load("models/soh_model.pkl")
rul_model = joblib.load("models/rul_model.pkl")


class BatteryInput(BaseModel):
    cycle: int
    voltage: float
    temperature: float
    capacity: float


@app.get("/")
def home():
    return {
        "message": "SecondSpark AI Battery Analytics API"
    }


@app.post("/api/v1/battery/grade")
def grade_battery(data: BatteryInput):

    sample = pd.DataFrame([{
        "cycle": data.cycle,
        "voltage": data.voltage,
        "temperature": data.temperature,
        "capacity": data.capacity
    }])

    # ML Predictions
    ml_soh = float(soh_model.predict(sample)[0])
    ml_rul = float(rul_model.predict(sample)[0])

    # Stable Hackathon Logic
    soh = round(data.capacity * 100, 2)

    # RUL Estimate
    rul = round((soh / 100) * 60, 2)

    # Recommendation Engine
    if soh >= 80:
        recommendation = "Continue EV Use"
        lifecycle_status = "Active"

    elif soh >= 60:
        recommendation = "Stationary Storage"
        lifecycle_status = "Second-Life"

    else:
        recommendation = "Recycle"
        lifecycle_status = "Recycling"

    return {
        "battery_metrics": {
            "soh_percent": soh,
            "rul_months": rul
        },

        "recommendation": recommendation,

        "lifecycle_status": lifecycle_status,

        "ai_insights": {
            "ml_soh_prediction": round(ml_soh * 100, 2),
            "ml_rul_prediction": round(ml_rul, 2)
        }
    }