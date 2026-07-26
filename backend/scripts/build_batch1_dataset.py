import h5py
import pandas as pd

file_path = r"data/raw/2017-05-12_batchdata_updated_struct_errorcorrect.mat"

f = h5py.File(file_path, "r")

summary_refs = f["batch"]["summary"]

all_batteries = []

num_batteries = summary_refs.shape[0]

print(f"Total Batteries: {num_batteries}")

for battery_idx in range(num_batteries):

    try:

        summary_ref = summary_refs[battery_idx][0]
        summary = f[summary_ref]

        data = {}

        for key in summary.keys():
            data[key] = summary[key][0]

        df = pd.DataFrame(data)

        # Clean data
        df = df[df["cycle"] > 0]
        df = df[df["QDischarge"] > 0]
        df = df[df["QDischarge"] < 1.2]

        if len(df) == 0:
            continue

        df = df.reset_index(drop=True)

        # SOH
        initial_capacity = (
            df[df["cycle"] <= 50]["QDischarge"]
            .mean()
        )

        if pd.isna(initial_capacity):
            continue

        df["SOH"] = (
            df["QDischarge"] / initial_capacity
        ) * 100

        # RUL
        cycle_life = int(df["cycle"].max())

        df["RUL"] = (
            cycle_life - df["cycle"]
        )

        # Battery ID
        df["battery_id"] = battery_idx + 1

        all_batteries.append(df)

        print(
            f"Battery {battery_idx + 1} "
            f"processed ({len(df)} rows)"
        )

    except Exception as e:

        print(
            f"Battery {battery_idx + 1} failed:"
        )
        print(e)

master_df = pd.concat(
    all_batteries,
    ignore_index=True
)

print("\nMASTER DATASET")
print(master_df.shape)

print(master_df.head())