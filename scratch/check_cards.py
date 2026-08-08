import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

cards = re.findall(r'<article[^>]*class="[^"]*project-card[^"]*"*.*?</article>', html, re.DOTALL)
print(f"Total project cards found: {len(cards)}")
for i, c in enumerate(cards):
    img = re.search(r'<img[^>]+src="([^"]+)"', c)
    title = re.search(r'<h3[^>]*class="project-title"[^>]*>(.*?)</h3>', c)
    print(f"Card {i+1}: img={img.group(1) if img else None}, title={title.group(1) if title else None}")
