import h5py
import pandas as pd

# ==========================

# LOAD BATTERY 1

# ==========================

file_path = r"data/raw/2017-05-12_batchdata_updated_struct_errorcorrect.mat"

f = h5py.File(file_path, "r")

summary_ref = f["batch"]["summary"][0][0]
summary = f[summary_ref]

# ==========================

# EXTRACT DATA

# ==========================

data = {}

for key in summary.keys():
 data[key] = summary[key][0]

df = pd.DataFrame(data)

# ==========================

# CLEAN DATA

# ==========================

# Remove invalid rows

df = df[df["cycle"] > 0]
df = df[df["QDischarge"] > 0]

# Remove abnormal capacity outlier

df = df[df["QDischarge"] < 1.2]

df = df.reset_index(drop=True)

# ==========================

# SOH CALCULATION

# ==========================

initial_capacity = df[df["cycle"] <= 50]["QDischarge"].mean()

df["SOH"] = (
df["QDischarge"] / initial_capacity
) * 100

# ==========================

# RUL CALCULATION

# ==========================

cycle_life = int(df["cycle"].max())

df["RUL"] = cycle_life - df["cycle"]

# ==========================

# OUTPUT

# ==========================

print("\nShape:")
print(df.shape)

print("\nSOH Summary:")
print(df["SOH"].describe())

print("\nRUL Head:")
print(df[["cycle", "RUL"]].head())

print("\nRUL Tail:")
print(df[["cycle", "RUL"]].tail())
