import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score
import joblib

# Load dataset
df = pd.read_csv("data/battery_cycle_level_dataset_CLEAN_FINAL.csv")

# Features
X = df[["cycle", "voltage", "temperature", "capacity"]]

# Target
y = df["soh"]

# Train/Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Model
model = RandomForestRegressor(
    n_estimators=100,
    random_state=42
)

# Train
model.fit(X_train, y_train)

# Predict
predictions = model.predict(X_test)

# Accuracy
score = r2_score(y_test, predictions)

print("R2 Score:", score)

print("\nFeature Importance:")

for feature, importance in zip(X.columns, model.feature_importances_):
    print(f"{feature}: {importance:.4f}")

# Save Model
joblib.dump(model, "soh_model.pkl")

print("Model Saved Successfully")