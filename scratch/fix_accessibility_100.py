import os
import re

base_dir = r"C:\Users\Hackim\.gemini\antigravity\scratch\hackim-portfolio"

# 1. Update CSS --text-muted for 100% WCAG AA Contrast compliance
css_path = os.path.join(base_dir, "css", "style.css")
with open(css_path, "r", encoding="utf-8") as f:
    css = f.read()

css = css.replace("--text-muted: #5A5A5A;", "--text-muted: #8E8E8E;")
css = css.replace("--text-muted: #666666;", "--text-muted: #8E8E8E;")

with open(css_path, "w", encoding="utf-8") as f:
    f.write(css)
print("Updated CSS color contrast --text-muted: #8E8E8E")

# 2. Update HTML files for unclosed header logo link, duplicate aria-labels, and span aria attributes
def fix_html_a11y(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        html = f.read()

    # Fix 1: Close header logo <a> tag before <nav>
    html = html.replace(
        '<img decoding="async" src="images/WordMark.webp" alt="Hackim" class="logo-img" width="136" height="28" fetchpriority="high">\n               <nav class="header-nav">',
        '<img decoding="async" src="images/WordMark.webp" alt="Hackim" class="logo-img" width="136" height="28" fetchpriority="high"></a>\n        <nav class="header-nav">'
    )
    html = html.replace(
        '<img decoding="async" src="images/WordMark.webp" alt="Hackim" class="logo-img" width="136" height="28" fetchpriority="high">\n        <nav class="header-nav">',
        '<img decoding="async" src="images/WordMark.webp" alt="Hackim" class="logo-img" width="136" height="28" fetchpriority="high"></a>\n        <nav class="header-nav">'
    )

    # Fix 2: Remove duplicate aria-label attributes on buttons
    html = html.replace('aria-label="Toggle text" aria-label="Toggle text view"', 'aria-label="Toggle text view"')
    html = html.replace('aria-label="Toggle text view" aria-label="Toggle text view"', 'aria-label="Toggle text view"')
    html = re.sub(r'aria-label="Toggle text"\s+aria-label="[^"]+"', 'aria-label="Toggle text view"', html)

    # Fix 3: Remove aria-label on generic span elements (prohibited by ARIA 1.2 spec)
    html = html.replace('<span class="project-link-badge" aria-label="View Project">', '<span class="project-link-badge" aria-hidden="true">')
    html = html.replace('<span class="skill-arrow" aria-label="Toggle description">', '<span class="skill-arrow" aria-hidden="true">')

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Fixed accessibility in {filepath}")

for fname in ["ar.html", "index.html", "index-ar.html"]:
    p = os.path.join(base_dir, fname)
    if os.path.exists(p):
        fix_html_a11y(p)
