import os
import re

def verify():
    print("--- VERIFYING INDEX.HTML ---")
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()
    
    # 1. Check hero-bg closing
    hero_bg_idx = html.find('<div class="hero-bg">')
    hero_content_idx = html.find('<div class="hero-content">')
    between = html[hero_bg_idx:hero_content_idx]
    div_count = between.count('<div')
    close_div_count = between.count('</div>')
    print(f"hero-bg block: <div count={div_count}, </div> count={close_div_count}")
    assert div_count == close_div_count, "hero-bg tag mismatch!"
    print("[PASS] hero-bg is properly closed!")

    # 2. Check hero titles reveal-text removed
    h1 = re.search(r'<h1[^>]*>', html)
    h2 = re.search(r'<h2[^>]*>', html)
    print(f"h1 tag: {h1.group(0) if h1 else None}")
    print(f"h2 tag: {h2.group(0) if h2 else None}")
    assert 'reveal-text' not in (h1.group(0) if h1 else ''), "h1 still has reveal-text!"
    assert 'reveal-text' not in (h2.group(0) if h2 else ''), "h2 still has reveal-text!"
    print("[PASS] reveal-text class removed from hero titles!")

    # 3. Check project cards images existence
    cards = re.findall(r'<article[^>]*class="[^"]*project-card[^"]*"[\s\S]*?</article>', html)
    print(f"Total project cards found: {len(cards)}")
    for i, c in enumerate(cards):
        img_match = re.search(r'<img[^>]+src="([^"]+)"', c)
        assert img_match is not None, f"Card {i+1} missing image src!"
        img_path = img_match.group(1)
        assert os.path.exists(img_path), f"Image file {img_path} does NOT exist on disk!"
        print(f"  Card {i+1} image valid: {img_path} ({os.path.getsize(img_path)} bytes)")
    print("[PASS] All project card images exist and are valid!")

    print("\n--- VERIFYING JS/SCRIPT.JS ---")
    with open('js/script.js', 'r', encoding='utf-8') as f:
        js = f.read()
    
    assert "meshBendingVertexShader" in js, "meshBendingVertexShader missing in script.js!"
    assert "meshBendingFragmentShader" in js, "meshBendingFragmentShader missing in script.js!"
    assert "animateHero()" in js, "animateHero() call missing in script.js!"
    print("[PASS] 3D mesh bending shader configured in script.js!")

    print("\n>>> ALL VERIFICATION TESTS PASSED SUCCESSFULLY! <<<")

if __name__ == '__main__':
    verify()
