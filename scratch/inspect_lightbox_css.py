import sys
sys.stdout.reconfigure(encoding='utf-8')

p = r"C:\Users\Hackim\.gemini\antigravity\scratch\hackim-portfolio\portfolio.html"
with open(p, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

pos_css = content.find('.lightbox-slider-wrap')
print(content[pos_css:pos_css+3000])
