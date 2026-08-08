import sys, re
sys.stdout.reconfigure(encoding='utf-8')

p = r"C:\Users\Hackim\.gemini\antigravity\scratch\hackim-portfolio\portfolio.html"
with open(p, 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

matches = [m.start() for m in re.finditer(r"window\.addEventListener\(['\"](?:wheel|mousedown|mousemove|mouseup|click|touchstart|touchmove)['\"]", c)]
print(f"Found {len(matches)} window event listeners:")
for idx in matches:
    print("--- EVENT LISTENER ---")
    print(c[idx:idx+350])
