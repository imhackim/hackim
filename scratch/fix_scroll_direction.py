import os, re

p = r"C:\Users\Hackim\.gemini\antigravity\scratch\hackim-portfolio\portfolio.html"
with open(p, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace wheel deltaY addition with subtraction to invert direction to natural scroll
new_content = re.sub(
    r'(window\.addEventListener\([\'"]wheel[\'"][^}]*?targetRotation\s*)\+=\s*(e\.deltaY)',
    r'\1-=\2',
    content
)

if new_content != content:
    with open(p, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("[SUCCESS] Reversed mouse wheel direction in portfolio.html to natural scroll!")
else:
    print("[WARN] Regex replacement failed to match.")
