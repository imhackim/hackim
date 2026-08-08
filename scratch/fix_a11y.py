import re, os, shutil

base = r"C:\Users\Hackim\.gemini\antigravity\scratch\hackim-portfolio"

for fname in ['ar.html', 'index.html']:
    fpath = os.path.join(base, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Fix buttons without aria-labels
    html = html.replace('<button class="text-flip-btn"', '<button class="text-flip-btn" aria-label="Toggle text"')
    
    # Remove duplicate aria-labels
    html = re.sub(r'(aria-label="[^"]+?")\s+aria-label="[^"]+?"', r'\1', html)
    
    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f'Accessibility fixes applied to {fname}')

shutil.copy2(os.path.join(base, 'ar.html'), os.path.join(base, 'index-ar.html'))
print('index-ar.html synced')
