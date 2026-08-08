import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

print("All IMG tags in index.html:")
for m in re.finditer(r'<img[^>]+src="([^"]+)"[^>]*class="([^"]+)"', html):
    print(f"src={m.group(1)}, class={m.group(2)}")
