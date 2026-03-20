import json
import urllib.request
import urllib.parse
import time

def fetch_images(scientific_names):
    base_url = "https://en.wikipedia.org/w/api.php"
    chunk_size = 50
    results = {}

    for i in range(0, len(scientific_names), chunk_size):
        chunk = scientific_names[i:i + chunk_size]
        titles = "|".join(chunk)
        params = {
            "action": "query",
            "titles": titles,
            "prop": "pageimages",
            "format": "json",
            "pithumbsize": 800,
            "origin": "*"
        }

        url = f"{base_url}?{urllib.parse.urlencode(params)}"

        req = urllib.request.Request(url, headers={'User-Agent': 'ChampionTreeExplorer/1.0 (contact@example.com)'})

        try:
            with urllib.request.urlopen(req) as response:
                data = json.loads(response.read().decode())
                pages = data.get("query", {}).get("pages", {})
                for page_id, page_info in pages.items():
                    title = page_info.get("title")
                    thumb = page_info.get("thumbnail", {}).get("source")
                    if thumb:
                        results[title] = thumb
        except Exception as e:
            print(f"Error fetching chunk: {e}")

        time.sleep(0.5)

    return results

# Load trees
with open('trees.json', 'r') as f:
    trees = json.load(f)

unique_names = list(set(tree['Scientific Name'] for tree in trees))
print(f"Found {len(unique_names)} unique species.")

image_map = fetch_images(unique_names)
print(f"Fetched images for {len(image_map)} species.")

count = 0
for tree in trees:
    img = image_map.get(tree['Scientific Name'])
    if img:
        tree['image_url'] = img
        count += 1

with open('trees.json', 'w') as f:
    json.dump(trees, f, indent=2)

print(f"Updated {count} trees with image URLs.")
