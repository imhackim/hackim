import os, re

base = r"C:\Users\Hackim\.gemini\antigravity\scratch\hackim-portfolio"
for fname in ['ar.html', 'index.html', 'index-ar.html']:
    p = os.path.join(base, fname)
    if os.path.exists(p):
        with open(p, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace keyImages array to only preload WordMark.webp and project1.webp
        content = re.sub(
            r'var keyImages = \[[^\]]+\];',
            "var keyImages = ['images/WordMark.webp', 'images/project1.webp'];",
            content
        )
        
        with open(p, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Updated keyImages in", fname)
