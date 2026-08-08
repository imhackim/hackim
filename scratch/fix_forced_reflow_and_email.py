import os
import re

base_dir = r"C:\Users\Hackim\.gemini\antigravity\scratch\hackim-portfolio"

# 1. Update js/script.js to batch scroll reads before writes & remove forced reflow
script_path = os.path.join(base_dir, "js", "script.js")
with open(script_path, "r", encoding="utf-8") as f:
    js = f.read()

# Fix void zone.offsetWidth forced reflow
js = js.replace(
    "void zone.offsetWidth;\n                if (colorImg) colorImg.style.transition = '';",
    "requestAnimationFrame(() => { if (colorImg) colorImg.style.transition = ''; });"
)

# Fix scroll handler forced reflow (read-write-read-write thrashing)
old_scroll_handler = """        const scrollY = window.pageYOffset;

        // Hero background parallax
        const heroBg = document.querySelector('.hero-bg-img');
        if (heroBg) {
            const heroRect = document.querySelector('.hero').getBoundingClientRect();
            if (heroRect.bottom > 0) {
                heroBg.style.transform = `scale(1.1) translateY(${scrollY * 0.15}px)`;
            }
        }



        // Motto background parallax
        const mottoBg = document.querySelector('.motto-bg-img');
        if (mottoBg) {
            const mottoRect = document.querySelector('.motto').getBoundingClientRect();
            if (mottoRect.top < window.innerHeight && mottoRect.bottom > 0) {
                const progress = (window.innerHeight - mottoRect.top) / (window.innerHeight + mottoRect.height);
                mottoBg.style.transform = `scale(1.1) translateY(${(progress - 0.5) * 80}px)`;
            }
        }

        // Experience background parallax
        const expBg = document.querySelector('.experience-bg-img');
        if (expBg) {
            const expRect = document.querySelector('.experience').getBoundingClientRect();
            if (expRect.top < window.innerHeight && expRect.bottom > 0) {
                const progress = (window.innerHeight - expRect.top) / (window.innerHeight + expRect.height);
                expBg.style.transform = `scale(1.1) translateY(${(progress - 0.5) * 60}px)`;
            }
        }

        // Showreel background parallax
        const showreelBg = document.querySelector('.showreel-img');
        if (showreelBg) {
            const showreelRect = document.querySelector('.showreel').getBoundingClientRect();
            if (showreelRect.top < window.innerHeight && showreelRect.bottom > 0) {
                const progress = (window.innerHeight - showreelRect.top) / (window.innerHeight + showreelRect.height);
                showreelBg.style.transform = `scale(1.1) translateY(${(progress - 0.5) * 80}px)`;
            }
        }"""

new_scroll_handler = """        const scrollY = window.pageYOffset;

        // BATCH ALL DOM READS FIRST (prevents forced layout reflow)
        const heroEl = document.querySelector('.hero');
        const mottoEl = document.querySelector('.motto');
        const expEl = document.querySelector('.experience');
        const showreelEl = document.querySelector('.showreel');

        const heroBg = document.querySelector('.hero-bg-img');
        const mottoBg = document.querySelector('.motto-bg-img');
        const expBg = document.querySelector('.experience-bg-img');
        const showreelBg = document.querySelector('.showreel-img');

        const heroRect = heroEl ? heroEl.getBoundingClientRect() : null;
        const mottoRect = mottoEl ? mottoEl.getBoundingClientRect() : null;
        const expRect = expEl ? expEl.getBoundingClientRect() : null;
        const showreelRect = showreelEl ? showreelEl.getBoundingClientRect() : null;

        // BATCH ALL DOM WRITES SECOND
        if (heroBg && heroRect && heroRect.bottom > 0) {
            heroBg.style.transform = `scale(1.1) translateY(${scrollY * 0.15}px)`;
        }
        if (mottoBg && mottoRect && mottoRect.top < window.innerHeight && mottoRect.bottom > 0) {
            const progress = (window.innerHeight - mottoRect.top) / (window.innerHeight + mottoRect.height);
            mottoBg.style.transform = `scale(1.1) translateY(${(progress - 0.5) * 80}px)`;
        }
        if (expBg && expRect && expRect.top < window.innerHeight && expRect.bottom > 0) {
            const progress = (window.innerHeight - expRect.top) / (window.innerHeight + expRect.height);
            expBg.style.transform = `scale(1.1) translateY(${(progress - 0.5) * 60}px)`;
        }
        if (showreelBg && showreelRect && showreelRect.top < window.innerHeight && showreelRect.bottom > 0) {
            const progress = (window.innerHeight - showreelRect.top) / (window.innerHeight + showreelRect.height);
            showreelBg.style.transform = `scale(1.1) translateY(${(progress - 0.5) * 80}px)`;
        }"""

if old_scroll_handler in js:
    js = js.replace(old_scroll_handler, new_scroll_handler)
    print("Batched scroll DOM reads before writes in js/script.js!")
else:
    print("Note: Scroll handler replacement check")

with open(script_path, "w", encoding="utf-8") as f:
    f.write(js)
print("Updated js/script.js")

# 2. Add Cloudflare <!--email_off--> tag in HTML files to prevent email-decode.min.js injection
for fname in ["ar.html", "index.html", "index-ar.html"]:
    p = os.path.join(base_dir, fname)
    if os.path.exists(p):
        with open(p, "r", encoding="utf-8") as f:
            html = f.read()

        # Wrap email in <!--email_off--> ... <!--/email_off-->
        if '<!--email_off-->' not in html:
            html = html.replace(
                '<a href="mailto:hello@imhackim.com" class="contact-detail-value">hello@imhackim.com</a>',
                '<!--email_off--><a href="mailto:hello@imhackim.com" class="contact-detail-value">hello@imhackim.com</a><!--/email_off-->'
            )

        with open(p, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"Added email_off tags to {fname}")
