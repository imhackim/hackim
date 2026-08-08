import os

p = r"C:\Users\Hackim\.gemini\antigravity\scratch\hackim-portfolio\portfolio.html"
with open(p, 'r', encoding='utf-8') as f:
    content = f.read()

old_str = "targetRotation -= e.deltaY * 0.0012;"
new_str = "targetRotation += e.deltaY * 0.0012;"

if old_str in content:
    content = content.replace(old_str, new_str)
    with open(p, 'w', encoding='utf-8') as f:
        f.write(content)
    print("[SUCCESS] Updated portfolio.html mouse wheel scroll to natural direction!")
else:
    print("[WARN] targetRotation -= e.deltaY * 0.0012; not found")
