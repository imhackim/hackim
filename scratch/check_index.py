import os, re

root = r"C:\Users\Hackim\.gemini\antigravity\scratch\hackim-portfolio"

with open(os.path.join(root, 'index.html'), 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

print("=== INDEX.HTML REFERENCE AUDIT ===")

# Find all src and href references
refs = re.findall(r'(?:src|href)=["\']([^"\']+)["\']', content)
missing = []
for ref in refs:
    if ref.startswith(('http://', 'https://', 'data:', '#', 'mailto:', 'tel:')):
        continue
    ref_clean = ref.split('?')[0].split('#')[0]
    full = os.path.join(root, ref_clean.replace('/', '\\'))
    if not os.path.exists(full):
        missing.append((ref, full))
        print(f"MISSING FILE IN INDEX.HTML: {ref}")

if not missing:
    print("All file paths linked in index.html exist on disk!")
