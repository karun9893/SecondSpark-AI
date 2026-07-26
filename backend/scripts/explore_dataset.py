import h5py

file_path = "data/raw/2017-05-12_batchdata_updated_struct_errorcorrect.mat"

f = h5py.File(file_path, "r")

summary_ref = f["batch"]["summary"][0][0]
summary = f[summary_ref]

for key in ["cycle", "QDischarge", "IR", "Tavg"]:
    print("\n" + "="*50)
    print(key)

    data = summary[key][0]

    print("First 20 values:")
    print(data[:20])

    print("Last 20 values:")
    print(data[-20:])