import os

base = r"C:\Users\Hackim\.gemini\antigravity\scratch\hackim-portfolio"
for fname in ['ar.html', 'index.html', 'index-ar.html']:
    p = os.path.join(base, fname)
    if os.path.exists(p):
        content = open(p, 'r', encoding='utf-8').read()
        if 'rel="preload" href="css/style.css"' not in content:
            content = content.replace(
                '<link rel="stylesheet" href="css/style.css">',
                '<link rel="preload" href="css/style.css" as="style">\n    <link rel="stylesheet" href="css/style.css">'
            )
            with open(p, 'w', encoding='utf-8') as f:
                f.write(content)
            print("Added CSS preload to", fname)
