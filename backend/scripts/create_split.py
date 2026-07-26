import pandas as pd

df = pd.read_csv("master_dataset.csv")

battery_ids = sorted(df["battery_id"].unique())

print("Total Batteries:", len(battery_ids))

train_batteries = battery_ids[:110]
test_batteries = battery_ids[110:]

print("Train Batteries:", len(train_batteries))
print("Test Batteries:", len(test_batteries))

train_df = df[df["battery_id"].isin(train_batteries)]
test_df = df[df["battery_id"].isin(test_batteries)]

print("\nTrain Shape:")
print(train_df.shape)

print("\nTest Shape:")
print(test_df.shape)

train_df.to_csv("train_dataset.csv", index=False)
test_df.to_csv("test_dataset.csv", index=False)

print("\nSaved:")
print("train_dataset.csv")
print("test_dataset.csv")