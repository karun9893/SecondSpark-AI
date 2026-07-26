import joblib
import pandas as pd

model = joblib.load("soh_model.pkl")

sample = pd.DataFrame([{
    "cycle": 1200,
    "voltage": 3.6,
    "temperature": 34,
    "capacity": 0.78
}])

prediction = model.predict(sample)

print("Predicted SOH:", prediction[0])
print("SOH %:", prediction[0] * 100)