import os

p = r"C:\Users\Hackim\.gemini\antigravity\scratch\hackim-portfolio\portfolio.html"
with open(p, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'wheel' in l.lower() or 'deltay' in l.lower():
        print(f"Line {i+1}: {repr(l.strip())}")
