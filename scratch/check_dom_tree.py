import os
from html.parser import HTMLParser

class ListStructureParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.errors = []

    def handle_starttag(self, tag, attrs):
        if self.stack and self.stack[-1] in ['ul', 'ol']:
            if tag not in ['li', 'script', 'template']:
                self.errors.append(f"<{self.stack[-1]}> contains direct invalid child <{tag}> at line {self.getpos()[0]}")
        self.stack.append(tag)

    def handle_endtag(self, tag):
        if self.stack and self.stack[-1] == tag:
            self.stack.pop()

base = r"C:\Users\Hackim\.gemini\antigravity\scratch\hackim-portfolio"
for fname in ['ar.html', 'index.html']:
    html = open(os.path.join(base, fname), 'r', encoding='utf-8').read()
    parser = ListStructureParser()
    parser.feed(html)
    print(f"=== {fname} LIST ERRORS ===")
    if parser.errors:
        for err in parser.errors:
            print("  -", err)
    else:
        print("  [PASS] PERFECT! All lists contain strictly <li> elements!")
