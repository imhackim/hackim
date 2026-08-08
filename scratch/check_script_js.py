import os

root = r"C:\Users\Hackim\.gemini\antigravity\scratch\hackim-portfolio"

with open(os.path.join(root, 'script.js'), 'r', encoding='utf-8') as f:
    code = f.read()

print(f"script.js length: {len(code)} characters")
print(f"Open curly brackets {{: {code.count('{')}")
print(f"Close curly brackets }}: {code.count('}')}")
print(f"Open parens (: {code.count('(')}")
print(f"Close parens ): {code.count(')')}")
print(f"Open square brackets [: {code.count('[')}")
print(f"Close square brackets ]: {code.count(']')}")
