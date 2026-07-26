import pandas as pd

df = pd.read_csv("master_dataset.csv")

print("Shape:")
print(df.shape)

print("\nUnique Batteries:")
print(df["battery_id"].nunique())

print("\nSOH Statistics:")
print(df["SOH"].describe())

print("\nRUL Statistics:")
print(df["RUL"].describe())

print("\nMissing Values:")
print(df.isnull().sum())