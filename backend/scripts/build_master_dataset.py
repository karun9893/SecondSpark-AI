import h5py
import pandas as pd

files = [
    "data/raw/2017-05-12_batchdata_updated_struct_errorcorrect.mat",
    "data/raw/2018-02-20_batchdata_updated_struct_errorcorrect.mat",
    "data/raw/2018-04-12_batchdata_updated_struct_errorcorrect.mat"
]

all_batteries = []

global_battery_id = 1

for file_path in files:

    print(f"\nProcessing: {file_path}")

    f = h5py.File(file_path, "r")

    summary_refs = f["batch"]["summary"]

    num_batteries = summary_refs.shape[0]

    print(f"Found {num_batteries} batteries")

    for battery_idx in range(num_batteries):

        try:

            summary_ref = summary_refs[battery_idx][0]
            summary = f[summary_ref]

            data = {}

            for key in summary.keys():
                data[key] = summary[key][0]

            df = pd.DataFrame(data)

            # Cleaning
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

            df["SOH"] = (
                df["QDischarge"] / initial_capacity
            ) * 100

            # RUL
            cycle_life = int(df["cycle"].max())

            df["RUL"] = cycle_life - df["cycle"]

            # Global battery id
            df["battery_id"] = global_battery_id

            all_batteries.append(df)

            global_battery_id += 1

        except Exception as e:

            print(
                f"Battery {battery_idx+1} failed"
            )
            print(e)

master_df = pd.concat(
    all_batteries,
    ignore_index=True
)

print("\nMASTER DATASET SHAPE")
print(master_df.shape)

print("\nColumns")
print(master_df.columns)

master_df.to_csv(
    "master_dataset.csv",
    index=False
)

print("\nSaved: master_dataset.csv")