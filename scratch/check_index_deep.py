import os, re

root = r"C:\Users\Hackim\.gemini\antigravity\scratch\hackim-portfolio"

deleted_files = [
    '404.mp3',
    'btn-ui.riv',
    'circuits.riv',
    'ln4.riv',
    'mob-landscape.riv',
    'page-transition.riv',
    'phrases.riv',
    'reef.riv',
    'signature.riv',
    'Logo-black.png',
    'ae-icon.png',
    'depth-map-mob.png',
    'Elcinema_Logo.svg',
    'IMDB.svg',
    'Portfolio.png',
    'Vimeo.svg',
    'lando-mask-desktop.svg',
    'mask-outline.png',
    'no-mask-mob.png',
    'ScrollTrigger.min.js',
    'gsap.min.js',
    'pixi.min.js',
    'assemble_wing.js',
    'assemble_wing.ps1',
    'server.ps1',
    'test.js'
]

with open(os.path.join(root, 'index.html'), 'r', encoding='utf-8', errors='ignore') as f:
    index_html = f.read()

found_in_index = []
for df in deleted_files:
    if df.lower() in index_html.lower():
        found_in_index.append(df)

print("Found deleted filenames mentioned in index.html:", found_in_index)
