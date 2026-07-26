import joblib
import pandas as pd

import sys
import os

sys.path.append(os.path.abspath("."))

from utils.recommendation import get_recommendation
# ==========================
# LOAD MODELS
# ==========================

soh_model = joblib.load("models/soh_model.pkl")
rul_model = joblib.load("models/rul_model.pkl")

# ==========================
# SAMPLE INPUT
# ==========================

sample = {
    "IR": 0.017,
    "QCharge": 1.05,
    "QDischarge": 1.03,
    "Tavg": 32,
    "Tmax": 35,
    "Tmin": 29,
    "chargetime": 13.2,
    "cycle": 600
}

# ==========================
# DATAFRAME
# ==========================

df = pd.DataFrame([sample])

# ==========================
# SOH PREDICTION
# ==========================

soh = soh_model.predict(df)[0]

# ==========================
# RUL PREDICTION
# ==========================

rul = rul_model.predict(df)[0]

# ==========================
# RECOMMENDATION
# ==========================

recommendation = get_recommendation(soh, rul)

# ==========================
# OUTPUT
# ==========================

print("\n===== BATTERY REPORT =====")

print(f"SOH : {soh:.2f}%")
print(f"RUL : {rul:.0f} cycles")

print(f"Recommendation : {recommendation}")