import sys, re
sys.stdout.reconfigure(encoding='utf-8')

p = r"C:\Users\Hackim\.gemini\antigravity\scratch\hackim-portfolio\portfolio.html"
with open(p, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

pos_db = content.find('const projectsDatabase = [')
print(content[pos_db:pos_db+3000])
