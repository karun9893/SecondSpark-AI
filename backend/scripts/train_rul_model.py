import pandas as pd
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import numpy as np
import joblib
# Load datasets
train_df = pd.read_csv("train_dataset.csv")
test_df = pd.read_csv("test_dataset.csv")

# Features
features = [
    "IR",
    "QCharge",
    "QDischarge",
    "Tavg",
    "Tmax",
    "Tmin",
    "chargetime",
    "cycle"
]

target = "RUL"

X_train = train_df[features]
y_train = train_df[target]

X_test = test_df[features]
y_test = test_df[target]

print("Training...")

model = XGBRegressor(
    n_estimators=300,
    max_depth=6,
    learning_rate=0.05,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

preds = model.predict(X_test)

mae = mean_absolute_error(y_test, preds)
rmse = np.sqrt(mean_squared_error(y_test, preds))
r2 = r2_score(y_test, preds)

print("\nRESULTS")
print(f"MAE : {mae:.4f}")
print(f"RMSE: {rmse:.4f}")
print(f"R2  : {r2:.4f}")

print("\nFeature Importance")

for feature, importance in zip(
    features,
    model.feature_importances_
):
    print(
        f"{feature}: {importance:.4f}"
    )

joblib.dump(model, "models/rul_model.pkl")

print("\nRUL Model Saved")