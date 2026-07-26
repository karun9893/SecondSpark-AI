import h5py

file_path = r"data/raw/2017-05-12_batchdata_updated_struct_errorcorrect.mat"

f = h5py.File(file_path, "r")

num_batteries = f["batch"]["summary"].shape[0]

print("Total Batteries:", num_batteries)

for i in [0, 1, 2, 10, 20, 30, 45]:
    summary_ref = f["batch"]["summary"][i][0]
    summary = f[summary_ref]

    cycle_count = len(summary["cycle"][0])

    print(
        f"Battery {i+1}: "
        f"{cycle_count} cycles"
    )