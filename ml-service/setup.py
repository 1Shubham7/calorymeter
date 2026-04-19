"""
One-time setup script.
Downloads the USDA SR Legacy food database and saves a clean foods.csv
that the Flask app reads on startup.

Run this once before starting app.py:
    python setup.py
"""

import csv
import io
import os
import zipfile

import requests

USDA_URL = (
    "https://fdc.nal.usda.gov/fdc-datasets/"
    "FoodData_Central_sr_legacy_food_csv_%202019-04-02.zip"
)

# Nutrient IDs in the USDA dataset
NUTRIENT_ENERGY  = "1008"   # Energy, kcal
NUTRIENT_FAT     = "1004"   # Total lipid (fat), g
NUTRIENT_PROTEIN = "1003"   # Protein, g


def download_and_process():
    print("Downloading USDA SR Legacy food database (~9 MB)...")
    response = requests.get(USDA_URL, stream=True, timeout=60)
    response.raise_for_status()

    print("Extracting archive...")
    z = zipfile.ZipFile(io.BytesIO(response.content))
    names = z.namelist()

    food_file     = next(n for n in names if n.endswith("food.csv"))
    nutrient_file = next(n for n in names if n.endswith("food_nutrient.csv"))

    print("Reading food descriptions...")
    foods = {}  # fdc_id -> description
    with z.open(food_file) as raw:
        reader = csv.DictReader(io.TextIOWrapper(raw, encoding="utf-8"))
        for row in reader:
            foods[row["fdc_id"]] = row["description"]

    print("Reading nutrient values (this may take a moment)...")
    energy  = {}  # fdc_id -> kcal
    fat     = {}  # fdc_id -> g
    protein = {}  # fdc_id -> g

    with z.open(nutrient_file) as raw:
        reader = csv.DictReader(io.TextIOWrapper(raw, encoding="utf-8"))
        for row in reader:
            nid = row["nutrient_id"]
            fid = row["fdc_id"]
            try:
                val = float(row["amount"])
            except (ValueError, KeyError):
                continue
            if nid == NUTRIENT_ENERGY:
                energy[fid] = val
            elif nid == NUTRIENT_FAT:
                fat[fid] = val
            elif nid == NUTRIENT_PROTEIN:
                protein[fid] = val

    print("Building clean dataset...")
    output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "foods.csv")
    count = 0
    with open(output_path, "w", newline="", encoding="utf-8") as out:
        writer = csv.writer(out)
        writer.writerow(["description", "calories", "fat", "protein"])
        for fid, desc in foods.items():
            if fid not in energy or energy[fid] <= 0:
                continue
            writer.writerow([
                desc,
                energy.get(fid, 0),
                fat.get(fid, 0),
                protein.get(fid, 0),
            ])
            count += 1

    print(f"\nDone! Saved {count:,} food items to foods.csv")
    print("You can now start the service with: python app.py")


if __name__ == "__main__":
    download_and_process()
