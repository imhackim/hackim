import os
import re

base_dir = r"C:\Users\Hackim\.gemini\antigravity\scratch\hackim-portfolio"

# 1. Update HTML files to use .webp images, add width/height & rel="noopener noreferrer"
def boost_html(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        html = f.read()

    # Preload Hero WebP image
    if 'rel="preload" href="images/project1' not in html:
        html = html.replace(
            '<link rel="preload" href="images/WordMark.png" as="image">',
            '<link rel="preload" href="images/WordMark.webp" as="image">\n    <link rel="preload" href="images/project1.webp" as="image" type="image/webp">'
        )
        if 'rel="preload" href="images/WordMark.png"' in html:
            html = html.replace('<link rel="preload" href="images/WordMark.png" as="image">', '<link rel="preload" href="images/WordMark.webp" as="image">')

    # Replace image paths to .webp (except SVG)
    html = re.sub(r'src=["\']images/([^"\']+\.(?:jpg|jpeg|png))["\']', lambda m: f'src="images/{os.path.splitext(m.group(1))[0]}.webp"', html)
    html = re.sub(r'content=["\']images/([^"\']+\.(?:jpg|jpeg|png))["\']', lambda m: f'content="images/{os.path.splitext(m.group(1))[0]}.webp"', html)

    # Ensure all target="_blank" links have rel="noopener noreferrer"
    def fix_blank_link(match):
        tag = match.group(0)
        if 'rel=' not in tag:
            tag = tag.replace('target="_blank"', 'target="_blank" rel="noopener noreferrer"')
        return tag
    html = re.sub(r'<a\s+[^>]*target="_blank"[^>]*>', fix_blank_link, html)

    # Explicit dimensions for client logos & icons to pass Best Practices & CLS
    dimensions = {
        'WordMark.webp': 'width="280" height="70"',
        'profile.webp': 'width="600" height="600"',
        'project1.webp': 'width="1200" height="675"',
        'project2.webp': 'width="1200" height="675"',
        'project3.webp': 'width="1200" height="675"',
        'project4.webp': 'width="1200" height="675"',
        'project5.webp': 'width="1200" height="675"',
        'project6.webp': 'width="1200" height="675"',
        'AbuAuf.webp': 'width="120" height="40"',
        'AutoOne.webp': 'width="120" height="40"',
        'BOLT.webp': 'width="120" height="40"',
        'Freedom.webp': 'width="120" height="40"',
        'Massar.webp': 'width="120" height="40"',
        'Movement.webp': 'width="120" height="40"',
        'MR1.webp': 'width="120" height="40"',
        'MS.webp': 'width="120" height="40"',
        'NUB.webp': 'width="120" height="40"',
        'QNB.webp': 'width="120" height="40"',
    }

    for img_name, dim_str in dimensions.items():
        pattern = f'src="images/{img_name}"'
        if pattern in html:
            # Only add if width is not already specified
            def add_dim(match):
                t = match.group(0)
                if 'width=' not in t:
                    t = t.replace('<img ', f'<img {dim_str} ')
                return t
            html = re.sub(r'<img\s+[^>]*src="images/' + re.escape(img_name) + r'"[^>]*>', add_dim, html)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Updated WebP & Best Practices in {filepath}")

for fname in ["ar.html", "index.html", "index-ar.html"]:
    p = os.path.join(base_dir, fname)
    if os.path.exists(p):
        boost_html(p)
