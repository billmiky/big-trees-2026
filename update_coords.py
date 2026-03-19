import json
import csv
import random

# State Abbreviation to FIPS first two digits
state_fips = {
    'AL': '01', 'AK': '02', 'AZ': '04', 'AR': '05', 'CA': '06', 'CO': '08', 'CT': '09', 'DE': '10', 'DC': '11',
    'FL': '12', 'GA': '13', 'HI': '15', 'ID': '16', 'IL': '17', 'IN': '18', 'IA': '19', 'KS': '20', 'KY': '21',
    'LA': '22', 'ME': '23', 'MD': '24', 'MA': '25', 'MI': '26', 'MN': '27', 'MS': '28', 'MO': '29', 'MT': '30',
    'NE': '31', 'NV': '32', 'NH': '33', 'NJ': '34', 'NM': '35', 'NY': '36', 'NC': '37', 'ND': '38', 'OH': '39',
    'OK': '40', 'OR': '41', 'PA': '42', 'RI': '44', 'SC': '45', 'SD': '46', 'TN': '47', 'TX': '48', 'UT': '49',
    'VT': '50', 'VA': '51', 'WA': '53', 'WV': '54', 'WI': '55', 'WY': '56'
}

# Load counties from CSV
counties_coords = {} # Key: (fips_state, county_name), Value: (lat, lng)
try:
    with open('counties.csv', 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            fips = row['fips_code'].zfill(5)
            state_code = fips[:2]
            name = row['name'].lower().replace(' county', '').replace(' parish', '').strip()
            counties_coords[(state_code, name)] = (float(row['lat']), float(row['lng']))
except Exception as e:
    print(f"Error loading counties.csv: {e}")

# State centroids as fallback
state_centroids = {
    "AL": [32.806671, -86.791130], "AK": [61.370716, -152.404419], "AZ": [33.729759, -111.431221],
    "AR": [34.969704, -92.373123], "CA": [36.116203, -119.681564], "CO": [39.059811, -105.311104],
    "CT": [41.597782, -72.755371], "DE": [39.318523, -75.507141], "FL": [27.766279, -81.686783],
    "GA": [33.040619, -83.643074], "HI": [21.094318, -157.498337], "ID": [44.240459, -114.478828],
    "IL": [40.349457, -88.986137], "IN": [39.849426, -86.258278], "IA": [42.011539, -93.210526],
    "KS": [38.526600, -96.726486], "KY": [37.668140, -84.670067], "LA": [31.169546, -91.867805],
    "ME": [44.693947, -69.381927], "MD": [39.063946, -76.802101], "MA": [42.230171, -71.530106],
    "MI": [43.326618, -84.536095], "MN": [45.694454, -93.900192], "MS": [32.741646, -89.678696],
    "MO": [38.456085, -92.288368], "MT": [46.921925, -110.454353], "NE": [41.125370, -98.268082],
    "NV": [38.313515, -117.055374], "NH": [43.452492, -71.563896], "NJ": [40.298904, -74.521011],
    "NM": [34.840515, -106.248482], "NY": [42.165726, -74.948051], "NC": [35.630066, -79.806419],
    "ND": [47.528912, -99.784012], "OH": [40.388783, -82.764915], "OK": [35.565342, -96.928917],
    "OR": [44.572021, -122.070938], "PA": [40.590752, -77.209755], "RI": [41.680893, -71.511784],
    "SC": [33.856892, -80.945007], "SD": [44.299782, -99.438828], "TN": [35.747845, -86.692345],
    "TX": [31.054487, -97.563461], "UT": [40.150032, -111.862434], "VT": [44.045876, -72.710686],
    "VA": [37.769337, -78.169968], "WA": [47.400902, -120.447258], "WV": [38.491226, -80.954457],
    "WI": [44.268543, -89.616508], "WY": [42.755966, -107.302490], "DC": [38.897438, -77.026817]
}

# Load trees
with open('trees.json', 'r') as f:
    trees = json.load(f)

count_matched = 0
count_fallback = 0

for tree in trees:
    state = tree.get('State', '').strip()
    county = tree.get('County', '').strip().lower()

    # Remove city if it's there (e.g. "Harrisonburg City")
    county_clean = county.replace(' city', '').strip()

    fips_st = state_fips.get(state)
    found = False

    if fips_st and (fips_st, county_clean) in counties_coords:
        lat, lng = counties_coords[(fips_st, county_clean)]
        tree['lat'] = lat + (random.random() - 0.5) * 0.1
        tree['lng'] = lng + (random.random() - 0.5) * 0.1
        count_matched += 1
        found = True

    if not found:
        # Fallback to state centroid
        if state in state_centroids:
            lat, lng = state_centroids[state]
            tree['lat'] = lat + (random.random() - 0.5) * 1.5
            tree['lng'] = lng + (random.random() - 0.5) * 1.5
            count_fallback += 1
        else:
            tree['lat'] = 39.8283 + (random.random() - 0.5) * 5.0
            tree['lng'] = -98.5795 + (random.random() - 0.5) * 5.0
            count_fallback += 1

# Save updated trees
with open('trees.json', 'w') as f:
    json.dump(trees, f, indent=2)

print(f"Updated {len(trees)} trees. Matched: {count_matched}, Fallback: {count_fallback}")
