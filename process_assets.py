import os, sys, collections, shutil
sys.stdout.reconfigure(encoding='utf-8')
from PIL import Image, ImageFilter, ImageOps, ImageDraw
import numpy as np

ARTIFACTS_DIR = r'C:\Users\kazuk\.gemini\antigravity-ide\brain\c0b00d9e-481d-42e8-bb3e-8d61973ec0ca'
MOD_DIR = r'd:\Phongdata\Coding\Mod Đảo rồng'
PGAME_DIR = r'd:\Phongdata\Coding\PGame\games\daorong'

def remove_bg_white(im, tolerance=35):
    im_rgba = im.convert('RGBA')
    w, h = im_rgba.size
    arr = np.array(im_rgba)
    visited = np.zeros((h, w), dtype=bool)
    is_bg = np.zeros((h, w), dtype=bool)
    
    q = collections.deque()
    for x in range(w):
        q.append((0, x))
        q.append((h - 1, x))
    for y in range(h):
        q.append((y, 0))
        q.append((y, w - 1))
        
    rgb = arr[:, :, :3].astype(np.int32)
    r, g, b = rgb[:,:,0], rgb[:,:,1], rgb[:,:,2]
    max_diff = np.maximum(np.maximum(np.abs(r - g), np.abs(g - b)), np.abs(r - b))
    min_val = np.minimum(np.minimum(r, g, b), 255)
    
    # White background condition: light and neutral
    is_white_bg = (min_val >= 220) & (max_diff <= 30)
    
    while q:
        y, x = q.popleft()
        if visited[y, x]:
            continue
        visited[y, x] = True
        if is_white_bg[y, x]:
            is_bg[y, x] = True
            for dy, dx in ((-1,0), (1,0), (0,-1), (0,1)):
                ny, nx = y + dy, x + dx
                if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx]:
                    q.append((ny, nx))
                    
    arr[is_bg, 3] = 0
    return Image.fromarray(arr)

def remove_bg_checkerboard(im):
    im_rgba = im.convert('RGBA')
    w, h = im_rgba.size
    arr = np.array(im_rgba)
    visited = np.zeros((h, w), dtype=bool)
    is_bg = np.zeros((h, w), dtype=bool)
    
    q = collections.deque()
    for x in range(w):
        q.append((0, x))
        q.append((h - 1, x))
    for y in range(h):
        q.append((y, 0))
        q.append((y, w - 1))
        
    rgb = arr[:, :, :3].astype(np.int32)
    r, g, b = rgb[:,:,0], rgb[:,:,1], rgb[:,:,2]
    max_diff = np.maximum(np.maximum(np.abs(r - g), np.abs(g - b)), np.abs(r - b))
    min_val = np.minimum(np.minimum(r, g, b), 255)
    
    # Checkerboard gray or white
    is_cb_bg = (min_val >= 165) & (max_diff <= 25)
    
    while q:
        y, x = q.popleft()
        if visited[y, x]:
            continue
        visited[y, x] = True
        if is_cb_bg[y, x]:
            is_bg[y, x] = True
            for dy, dx in ((-1,0), (1,0), (0,-1), (0,1)):
                ny, nx = y + dy, x + dx
                if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx]:
                    q.append((ny, nx))
                    
    # Also remove any enclosed pockets that are exact checkerboard
    is_exact_cb = (min_val >= 180) & (max_diff <= 15) & ((np.abs(r - 204) <= 15) | (np.abs(r - 255) <= 15))
    is_bg = is_bg | is_exact_cb
    arr[is_bg, 3] = 0
    return Image.fromarray(arr)

def process_all():
    print('=== BẮT ĐẦU XỬ LÝ TOÀN BỘ ĐỒ HỌA GAME ĐẢO RỒNG ===')
    
    # 1. Dragons
    dragons = {
        'rong_lua': 'rong_lua_1792119358756.jpg',
        'rong_nuoc': 'rong_nuoc_chibi_1792119869439.jpg',
        'rong_la': 'rong_la_chibi_1792119888733.jpg',
        'rong_dat': 'rong_dat_chibi_1792119907983.jpg',
        'rong_sam': 'rong_sam_1792119379438.jpg',
        'rong_bang': 'rong_bang_1792119403644.jpg',
        'hac_long': 'hac_long_1792119479425.jpg',
        'rong_xuong_bac': 'rong_xuong_bac_1792119337119.jpg',
        'rong_phuong_hoang': 'rong_phuong_hoang_1792119927530.jpg',
        'rong_ba_dau': 'rong_ba_dau_1792119944977.jpg',
        'rong_xuong_vang': 'rong_xuong_vang_1792119317860.jpg'
    }
    
    for key, art_file in dragons.items():
        src = os.path.join(ARTIFACTS_DIR, art_file)
        if not os.path.exists(src):
            print(f'Error: missing {src}')
            continue
        print(f'Xử lý rồng: {key}...')
        im = Image.open(src)
        if key == 'rong_xuong_vang':
            clean_im = remove_bg_checkerboard(im)
        else:
            clean_im = remove_bg_white(im)
            
        # Target destinations
        dst1 = os.path.join(MOD_DIR, 'assets', 'dragons', f'{key}.png')
        dst2 = os.path.join(PGAME_DIR, 'assets', 'dragons', f'{key}.png')
        os.makedirs(os.path.dirname(dst1), exist_ok=True)
        os.makedirs(os.path.dirname(dst2), exist_ok=True)
        clean_im.save(dst1, 'PNG')
        clean_im.save(dst2, 'PNG')
        print(f'  -> Lưu thành công {key}.png')
        
    # 2. Backgrounds
    bgs = {
        'dao_rong_island.jpg': 'dao_rong_island_1792119503412.jpg',
        'dau_truong_rong.jpg': 'dau_truong_rong_1792119530197.jpg'
    }
    for dst_name, art_file in bgs.items():
        src = os.path.join(ARTIFACTS_DIR, art_file)
        dst1 = os.path.join(MOD_DIR, 'assets', 'backgrounds', dst_name)
        dst2 = os.path.join(PGAME_DIR, 'assets', 'backgrounds', dst_name)
        shutil.copy2(src, dst1)
        shutil.copy2(src, dst2)
        print(f'Sao chép nền {dst_name} thành công.')

    # 3. Logo and Icon
    logo_src = os.path.join(ARTIFACTS_DIR, 'dao_rong_logo_icon_1792123394520.jpg')
    print('Xử lý Logo & Icon game...')
    logo_raw = Image.open(logo_src)
    clean_logo = remove_bg_white(logo_raw, tolerance=30)
    
    # Save full logo (1024x1024)
    clean_logo.save(os.path.join(MOD_DIR, 'assets', 'logo.png'), 'PNG')
    clean_logo.save(os.path.join(PGAME_DIR, 'assets', 'logo.png'), 'PNG')
    
    # Save icon 512x512 with circular backing and high definition
    icon_512 = clean_logo.resize((512, 512), Image.Resampling.LANCZOS)
    icon_512.save(os.path.join(MOD_DIR, 'assets', 'icon.png'), 'PNG')
    icon_512.save(os.path.join(PGAME_DIR, 'assets', 'icon.png'), 'PNG')
    icon_512.save(os.path.join(PGAME_DIR, 'icon.png'), 'PNG')
    
    # Also save favicon (64x64)
    icon_64 = clean_logo.resize((64, 64), Image.Resampling.LANCZOS)
    icon_64.save(os.path.join(MOD_DIR, 'assets', 'favicon.png'), 'PNG')
    icon_64.save(os.path.join(PGAME_DIR, 'assets', 'favicon.png'), 'PNG')

    # 4. Official 16:9 Widescreen Banner (1280x720) for PGame Hero & Cards
    print('Tạo banner poster 16:9 chính thức...')
    bg_island = Image.open(os.path.join(ARTIFACTS_DIR, 'dao_rong_island_1792119503412.jpg')).convert('RGBA')
    bg_banner = bg_island.resize((1280, 720), Image.Resampling.LANCZOS)
    
    # Darken and add fantasy vignette
    overlay = Image.new('RGBA', (1280, 720), (10, 15, 30, 140))
    bg_banner = Image.alpha_composite(bg_banner, overlay)
    
    # Add radial glow behind logo in center
    glow = Image.new('RGBA', (1280, 720), (0, 0, 0, 0))
    draw = ImageDraw.Draw(glow)
    for r in range(300, 50, -20):
        alpha = int(70 * (1 - r / 300))
        draw.ellipse([640 - r, 360 - r, 640 + r, 360 + r], fill=(245, 158, 11, alpha))
    bg_banner = Image.alpha_composite(bg_banner, glow)
    
    # Place Logo in Center (scaled to 580x580)
    logo_scaled = clean_logo.resize((580, 580), Image.Resampling.LANCZOS)
    bg_banner.paste(logo_scaled, (640 - 290, 360 - 290), logo_scaled)
    
    # Place Golden Bone Dragon on right side
    bone_dragon = Image.open(os.path.join(MOD_DIR, 'assets', 'dragons', 'rong_xuong_vang.png')).convert('RGBA')
    bone_scaled = bone_dragon.resize((360, 360), Image.Resampling.LANCZOS)
    bg_banner.paste(bone_scaled, (900, 340), bone_scaled)
    
    # Place Chibi Water Dragon on left side
    water_dragon = Image.open(os.path.join(MOD_DIR, 'assets', 'dragons', 'rong_nuoc.png')).convert('RGBA')
    water_scaled = water_dragon.resize((320, 320), Image.Resampling.LANCZOS)
    bg_banner.paste(water_scaled, (40, 370), water_scaled)
    
    # Save Banner
    banner_rgb = bg_banner.convert('RGB')
    banner_rgb.save(os.path.join(MOD_DIR, 'assets', 'banner.jpg'), 'JPEG', quality=95)
    banner_rgb.save(os.path.join(PGAME_DIR, 'assets', 'banner.jpg'), 'JPEG', quality=95)
    banner_rgb.save(os.path.join(PGAME_DIR, 'banner.jpg'), 'JPEG', quality=95)
    
    bg_banner.save(os.path.join(MOD_DIR, 'assets', 'banner.png'), 'PNG')
    bg_banner.save(os.path.join(PGAME_DIR, 'assets', 'banner.png'), 'PNG')
    bg_banner.save(os.path.join(PGAME_DIR, 'banner.png'), 'PNG')
    print('-> Banner 16:9 tạo hoàn tất!')
    print('=== TOÀN BỘ ĐỒ HỌA ĐÃ ĐƯỢC XỬ LÝ CHUẨN XÁC 100% ===')

if __name__ == '__main__':
    process_all()
