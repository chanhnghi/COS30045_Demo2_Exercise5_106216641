"""Prepare the Week 5 TV summaries from their respective source datasets."""

import csv
from collections import defaultdict
from pathlib import Path


data_dir = Path(__file__).resolve().parent
energy_source = data_dir / "Ex6_TVdata_withStar.csv"
size_source = data_dir / "tv_2026_02_15.csv"

with energy_source.open(newline="", encoding="utf-8-sig") as stream:
    energy_rows = list(csv.DictReader(stream))

energy_by_type = defaultdict(list)
for row in energy_rows:
    size = float(row["screenSize"])
    energy = float(row["energyConsumption"])
    screen_type = row["screenTech"].strip()

    if size == 55:
        energy_by_type[screen_type].append(energy)


size_counts = {"Small": 0, "Medium": 0, "Large": 0}
with size_source.open(newline="", encoding="utf-8-sig") as stream:
    for row in csv.DictReader(stream):
        if "Australia" not in row["SoldIn"] or row["Availability Status"] != "Available":
            continue

        size_inches = float(row["screensize"]) / 2.54
        category = "Small" if size_inches < 42 else "Medium" if size_inches <= 65 else "Large"
        size_counts[category] += 1

with (data_dir / "tv-55-inch-screen-type.csv").open("w", newline="", encoding="utf-8") as stream:
    writer = csv.writer(stream)
    writer.writerow(("screenTech", "meanEnergyConsumption", "models"))
    for screen_type, values in sorted(energy_by_type.items()):
        writer.writerow((screen_type, f"{sum(values) / len(values):.2f}", len(values)))

with (data_dir / "tv-screen-size-groups.csv").open("w", newline="", encoding="utf-8") as stream:
    writer = csv.writer(stream)
    writer.writerow(("sizeGroup", "count"))
    for category, count in size_counts.items():
        writer.writerow((category, count))

print(f"Prepared {sum(map(len, energy_by_type.values()))} 55-inch TVs and {sum(size_counts.values())} size-group records")
