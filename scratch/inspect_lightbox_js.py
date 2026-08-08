import sys
sys.stdout.reconfigure(encoding='utf-8')

p = r"C:\Users\Hackim\.gemini\antigravity\scratch\hackim-portfolio\portfolio.html"
with open(p, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

pos_js = content.find('function openLightboxGallery')
print(content[pos_js:pos_js+3500])
