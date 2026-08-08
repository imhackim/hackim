"""
Comprehensive Performance Optimization Script
1. Convert TTF/OTF fonts to WOFF2 (massive size reduction)
2. Compress/resize images  
3. Report savings
"""
import os
import sys
import shutil

BASE = r"C:\Users\Hackim\.gemini\antigravity\scratch\hackim-portfolio"

# ===== 1. CONVERT FONTS TO WOFF2 =====
print("=" * 60)
print("STEP 1: Converting fonts to WOFF2")
print("=" * 60)

try:
    from fontTools.ttLib import TTFont
    from fontTools import subset as ftsubset

    fonts_dir = os.path.join(BASE, "fonts")
    font_files = [f for f in os.listdir(fonts_dir) if f.endswith(('.ttf', '.otf'))]
    
    total_original = 0
    total_woff2 = 0
    
    for font_file in font_files:
        src = os.path.join(fonts_dir, font_file)
        original_size = os.path.getsize(src)
        total_original += original_size
        
        # Output WOFF2 name
        base_name = os.path.splitext(font_file)[0]
        dst = os.path.join(fonts_dir, base_name + ".woff2")
        
        print(f"\n  Converting: {font_file} ({original_size/1024:.1f} KB)")
        
        # For SF-Pro (5.8MB!), subset to Latin + common punctuation + numbers only
        if "SF-Pro" in font_file:
            # Subset SF-Pro to drastically reduce size
            subsetter_args = [
                src,
                "--output-file=" + dst,
                "--flavor=woff2",
                "--layout-features=*",
                "--unicodes=U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD,U+2018-2019,U+201C-201D,U+2013-2014,U+2026,U+00D7,U+2190-2193,U+2022"
            ]
            subsetter = ftsubset.Subsetter()
            font = TTFont(src)
            subsetter.populate(unicodes=[
                i for r in [
                    range(0x0000, 0x0100),  # Basic Latin + Latin-1 Supplement
                    range(0x2000, 0x2070),  # General Punctuation
                    range(0x2018, 0x201E),  # Quotation marks
                    range(0x2190, 0x2194),  # Arrows
                    [0x0131, 0x0152, 0x0153, 0x02BB, 0x02BC, 0x02C6, 0x02DA, 0x02DC,
                     0x2074, 0x20AC, 0x2122, 0x2212, 0x2215, 0xFEFF, 0xFFFD, 0x2022,
                     0x00D7, 0x2013, 0x2014, 0x2026]
                ] for i in (r if hasattr(r, '__iter__') else [r])
            ])
            subsetter.subset(font)
            font.flavor = 'woff2'
            font.save(dst)
            font.close()
        elif "Palestine" in font_file:
            # Subset Palestine to Arabic + Arabic Presentation Forms + basic Latin digits
            font = TTFont(src)
            subsetter = ftsubset.Subsetter()
            subsetter.populate(unicodes=[
                i for r in [
                    range(0x0600, 0x06FF),  # Arabic
                    range(0x0750, 0x077F),  # Arabic Supplement
                    range(0xFB50, 0xFDFF),  # Arabic Presentation Forms-A
                    range(0xFE70, 0xFEFF),  # Arabic Presentation Forms-B
                    range(0x0020, 0x007F),  # Basic Latin (space, digits, punctuation)
                    range(0x2000, 0x206F),  # General Punctuation
                    [0x060C, 0x061B, 0x061F, 0x0640, 0x066A, 0x066B, 0x066C, 0x06D4]
                ] for i in (r if hasattr(r, '__iter__') else [r])
            ])
            subsetter.subset(font)
            font.flavor = 'woff2'
            font.save(dst)
            font.close()
        else:
            # Regular conversion to WOFF2 (Callgest, Metropolis)
            font = TTFont(src)
            font.flavor = 'woff2'
            font.save(dst)
            font.close()
        
        woff2_size = os.path.getsize(dst)
        total_woff2 += woff2_size
        savings = (1 - woff2_size / original_size) * 100
        print(f"  -> {base_name}.woff2 ({woff2_size/1024:.1f} KB) — saved {savings:.0f}%")
    
    print(f"\n  TOTAL FONTS: {total_original/1024:.0f} KB -> {total_woff2/1024:.0f} KB (saved {(1-total_woff2/total_original)*100:.0f}%)")

except Exception as e:
    print(f"  ERROR with fonts: {e}")
    import traceback
    traceback.print_exc()

# ===== 2. COMPRESS IMAGES =====
print("\n" + "=" * 60)
print("STEP 2: Compressing images")
print("=" * 60)

try:
    from PIL import Image
    
    images_dir = os.path.join(BASE, "images")
    total_img_original = 0
    total_img_compressed = 0
    
    # Compress JPEGs
    for root, dirs, files in os.walk(images_dir):
        for f in files:
            fpath = os.path.join(root, f)
            original_size = os.path.getsize(fpath)
            
            if f.lower().endswith(('.jpg', '.jpeg')):
                total_img_original += original_size
                img = Image.open(fpath)
                
                # Resize if width > 1200px (good enough for web)
                if img.width > 1200:
                    ratio = 1200 / img.width
                    new_h = int(img.height * ratio)
                    img = img.resize((1200, new_h), Image.LANCZOS)
                
                # Save optimized JPEG at quality 82 (visually indistinguishable)
                img.save(fpath, 'JPEG', quality=82, optimize=True, progressive=True)
                new_size = os.path.getsize(fpath)
                total_img_compressed += new_size
                savings = (1 - new_size / original_size) * 100
                rel = os.path.relpath(fpath, BASE)
                print(f"  {rel}: {original_size/1024:.0f}KB -> {new_size/1024:.0f}KB ({savings:.0f}% saved)")
                img.close()
                
            elif f.lower().endswith('.png'):
                total_img_original += original_size
                img = Image.open(fpath)
                
                # For PNGs, re-save optimized
                if img.width > 800:
                    ratio = 800 / img.width
                    new_h = int(img.height * ratio)
                    img = img.resize((800, new_h), Image.LANCZOS)
                
                img.save(fpath, 'PNG', optimize=True)
                new_size = os.path.getsize(fpath)
                total_img_compressed += new_size
                savings = (1 - new_size / original_size) * 100 if original_size > 0 else 0
                rel = os.path.relpath(fpath, BASE)
                if savings > 1:
                    print(f"  {rel}: {original_size/1024:.0f}KB -> {new_size/1024:.0f}KB ({savings:.0f}% saved)")
                img.close()
    
    if total_img_original > 0:
        print(f"\n  TOTAL IMAGES: {total_img_original/1024:.0f} KB -> {total_img_compressed/1024:.0f} KB (saved {(1-total_img_compressed/total_img_original)*100:.0f}%)")

except Exception as e:
    print(f"  ERROR with images: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 60)
print("OPTIMIZATION COMPLETE!")
print("=" * 60)
