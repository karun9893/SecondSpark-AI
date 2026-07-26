# train_rul.py

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score
import joblib

df = pd.read_csv("battery_cycle_level_dataset_CLEAN_FINAL.csv")

X = df[["cycle", "voltage", "temperature", "capacity"]]

y = df["rul"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

model = RandomForestRegressor(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)

preds = model.predict(X_test)

print("R2 Score:", r2_score(y_test, preds))

joblib.dump(model, "rul_model.pkl")

print("RUL Model Saved Successfully")