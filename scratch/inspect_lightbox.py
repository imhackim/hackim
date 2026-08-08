import sys, re
sys.stdout.reconfigure(encoding='utf-8')

p = r"C:\Users\Hackim\.gemini\antigravity\scratch\hackim-portfolio\portfolio.html"
with open(p, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

print("--- LIGHTBOX HTML MARKUP ---")
pos = content.find('id="projectLightbox"')
print(content[pos-50:pos+2000])

print("\n--- LIGHTBOX CSS STYLES ---")
pos_css = content.find('.lightbox-modal-overlay')
print(content[pos_css:pos_css+3500])
