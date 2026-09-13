#!/usr/bin/env python3
"""
Visiosoft hero videosu üretim betiği (v3: iki sahne).

Sahne 1: araç yaklaşır, kamera plakayı tespit eder (runway-hero/ilkvideo.mp4).
Sahne 2: sürücü kioskta öder, bariyer açılır, araç çıkar (runway-hero/kullanclaude.mp4).
Çıktı:   frontend/public/video/hero/{hero-1080.mp4, hero-720.mp4, hero-1080.webm, poster.webp, poster.jpg, timeline.json}

Gereksinimler (macOS): ffmpeg (libx264 + libvpx-vp9), Xcode komut satırı araçları (swiftc, Vision) ve Pillow.
    python3 -m venv .venv && .venv/bin/pip install pillow
    .venv/bin/python scripts/hero-video/build.py

Kiosk ekranı, AI klibindeki "Payco" logolu kırmızı özet yerine Pillow ile çizilen VISIOSOFT arayüzüyle kaplanır
(kart okutulunca 'ÖDENDİ'); POS cihazının ön yüzü de aynı dilde çizilir (tutar + temassız simgesi -> 'Onaylandı').
Araç çıkarken ekranın önünden geçtiği ve el/kart POS'un önünde durduğu için bu katmanlar, Apple Vision "subject
lifting" (liftmask.swift) ile çıkarılan araç/el maskesinin altına yerleştirilir. KlingAI filigranı 1. sahnede kırpma, 2. sahnede delogo ile silinir.
Segment süreleri değişirse timeline.json'daki xfadeStart değerlerine göre src/components/Hero/heroTimeline.ts güncellenmelidir.
"""
import json
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFont

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
R = ROOT / 'runway-hero'
PUB = ROOT / 'frontend' / 'public'
OUT = PUB / 'video' / 'hero'
WORK = Path(tempfile.mkdtemp(prefix='hero-video-'))
OUT.mkdir(parents=True, exist_ok=True)

W, H, FPS, XF = 1920, 1080, 24, 0.5
INTER = ['-c:v', 'libx264', '-crf', '12', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', '-an']
GRADE = 'eq=contrast=1.04:saturation=1.06,vignette=angle=PI/4.8'
FONT = '/System/Library/Fonts/HelveticaNeue.ttc'
S1_HOLD = 0.6          # plaka doğrulandı karesi bu kadar tutulur
PAID_AT = 1.0          # 2. sahnede kiosk ekranının 'ÖDENDİ' olduğu an (sn)
POS_AT = 0.6           # POS cihazının kartı onayladığı an (sn)
SCREEN_BOX = (1617, 42, 1833, 542)   # kiosk ekranının 1920x1080 karedeki yeri
POS_BOX = (1612, 585, 1691, 741)     # POS cihazı ön panelinin yeri


def run(args):
    args = [str(a) for a in args]
    print('$', ' '.join(args)[:420], flush=True)
    subprocess.run(args, check=True)


def ffmpeg(*args):
    run(['ffmpeg', '-y', '-v', 'error', *args])


def frames_of(path):
    out = subprocess.check_output([
        'ffprobe', '-v', 'error', '-select_streams', 'v:0', '-count_frames',
        '-show_entries', 'stream=nb_read_frames', '-of', 'json', str(path)])
    return int(json.loads(out)['streams'][0]['nb_read_frames'])


def ensure(p):
    p.mkdir(parents=True, exist_ok=True)
    return p


LIFT = WORK / 'liftmask'
run(['swiftc', '-O', '-o', LIFT, HERE / 'liftmask.swift'])


# ---------------------------------------------------------------- kiosk screen UI
def font(size, bold=False):
    return ImageFont.truetype(FONT, size, index=1 if bold else 0)


def render_screen(state):
    SW, SH = 420, 990
    BG, CARD, LINE = (245, 246, 248), (255, 255, 255), (226, 228, 233)
    INK, MUTED, BRAND = (29, 29, 31), (110, 110, 115), (0, 113, 227)
    GREEN, GREEN_BG = (22, 163, 74), (232, 248, 238)
    AMBER, AMBER_BG = (180, 110, 0), (255, 247, 230)
    im = Image.new('RGB', (SW, SH), BG)
    d = ImageDraw.Draw(im)

    def card(box, fill=CARD, outline=LINE):
        d.rounded_rectangle(box, 14, fill=fill, outline=outline, width=2)

    def center(y, text, f, fill, x0=0, x1=SW):
        d.text(((x0 + x1 - d.textlength(text, font=f)) / 2, y), text, font=f, fill=fill)

    d.rectangle([0, 0, SW, 64], fill=CARD)
    d.line([0, 64, SW, 64], fill=LINE, width=2)
    d.text((22, 18), 'VISIOSOFT', font=font(24, True), fill=BRAND)
    d.rounded_rectangle([SW - 96, 18, SW - 22, 46], 14, fill=GREEN_BG)
    d.ellipse([SW - 86, 26, SW - 74, 38], fill=GREEN)
    d.text((SW - 68, 22), 'Bağlı', font=font(16, True), fill=GREEN)
    y = 92
    card([22, y, SW - 22, y + 118])
    center(y + 14, 'PLAKA', font(14, True), MUTED)
    pw, ph = 236, 52
    px, py = (SW - pw) // 2, y + 44
    d.rounded_rectangle([px, py, px + pw, py + ph], 6, fill=CARD, outline=(40, 40, 45), width=3)
    d.rectangle([px + 3, py + 3, px + 30, py + ph - 3], fill=(17, 64, 196))
    d.text((px + 8, py + 17), 'TR', font=font(13, True), fill=(255, 255, 255))
    d.text((px + 44, py + 9), '34 PBB 261', font=font(30, True), fill=INK)
    y += 134
    card([22, y, SW - 22, y + 96])
    center(y + 14, 'PARK SÜRESİ', font(14, True), MUTED)
    center(y + 40, '3 saat 6 dakika', font(30, True), INK)
    y += 112
    half = (SW - 44 - 12) // 2
    card([22, y, 22 + half, y + 96])
    card([34 + half, y, SW - 22, y + 96])
    center(y + 14, 'GİRİŞ', font(14, True), MUTED, 22, 22 + half)
    center(y + 42, '16:31', font(28, True), INK, 22, 22 + half)
    center(y + 14, 'ÇIKIŞ', font(14, True), MUTED, 34 + half, SW - 22)
    center(y + 42, '19:38', font(28, True), INK, 34 + half, SW - 22)
    y += 112
    if state == 'due':
        card([22, y, SW - 22, y + 150])
        center(y + 16, 'ÖDENECEK TUTAR', font(14, True), MUTED)
        center(y + 52, '90 ₺', font(64, True), INK)
    else:
        card([22, y, SW - 22, y + 150], fill=GREEN_BG, outline=(160, 220, 185))
        center(y + 16, 'ÖDENDİ', font(14, True), GREEN)
        center(y + 52, '90 ₺', font(64, True), GREEN)
        cx, cy = SW - 62, y + 34
        d.ellipse([cx - 16, cy - 16, cx + 16, cy + 16], fill=GREEN)
        d.line([(cx - 8, cy), (cx - 2, cy + 6), (cx + 9, cy - 7)], fill=(255, 255, 255), width=4)
    y += 166
    if state == 'due':
        card([22, y, SW - 22, y + 112], fill=AMBER_BG, outline=(245, 215, 160))
        d.ellipse([40, y + 40, 72, y + 72], outline=AMBER, width=3)
        d.text((52, y + 45), 'i', font=font(20, True), fill=AMBER)
        d.text((88, y + 28), 'Lütfen kartınızı POS', font=font(21, True), fill=(120, 75, 0))
        d.text((88, y + 58), 'cihazına okutunuz', font=font(21, True), fill=(120, 75, 0))
    else:
        card([22, y, SW - 22, y + 112])
        d.text((40, y + 22), 'Ödeme alındı', font=font(22, True), fill=GREEN)
        d.text((40, y + 54), 'Fişiniz yazdırılıyor · İyi yolculuklar', font=font(17), fill=MUTED)
    d.text((22, SH - 40), 'İnsansız çıkış · Temassız · QR · HGS', font=font(15), fill=MUTED)
    return im


def screen_layer(state, out):
    """Yalnızca ekran alanını içeren, geri kalanı saydam tam kare katman."""
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    x0, y0, x1, y1 = SCREEN_BOX
    scr = render_screen(state).resize((x1 - x0, y1 - y0), Image.LANCZOS).convert('RGBA')
    scr = ImageEnhance.Brightness(scr).enhance(0.97)
    layer.alpha_composite(scr, (x0, y0))
    layer.save(out)
    return out


# ---------------------------------------------------------------- POS terminal panel (same visual language)
def render_pos(state):
    PW, PH = 237, 468
    BRAND, INK, MUTED, GREEN = (0, 113, 227), (29, 29, 31), (110, 110, 115), (22, 163, 74)
    im = Image.new('RGBA', (PW, PH), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([0, 0, PW - 1, PH - 1], 16, fill=(247, 248, 250, 255))

    def center(y, text, f, fill):
        d.text(((PW - d.textlength(text, font=f)) / 2, y), text, font=f, fill=fill)

    center(16, 'VISIOSOFT', font(21, True), BRAND)
    if state == 'due':
        center(48, 'TUTAR', font(16, True), MUTED)
        center(68, '90 ₺', font(58, True), INK)
        cx, cy = PW // 2 + 10, 232
        for r in (16, 32, 48):
            d.arc([cx - r, cy - r, cx + r, cy + r], 300, 60, fill=BRAND, width=7)
        d.rounded_rectangle([cx - 66, cy - 22, cx - 26, cy + 22], 6, outline=BRAND, width=6)
        center(318, 'Kartınızı', font(24, True), INK)
        center(348, 'okutunuz', font(24, True), INK)
    else:
        cx, cy = PW // 2, 118
        d.ellipse([cx - 40, cy - 40, cx + 40, cy + 40], fill=GREEN)
        d.line([(cx - 20, cy + 2), (cx - 6, cy + 16), (cx + 22, cy - 16)], fill=(255, 255, 255), width=9)
        center(176, 'Onaylandı', font(30, True), GREEN)
        center(222, '90 ₺', font(52, True), GREEN)
        center(300, 'İşlem başarılı', font(22), MUTED)
        center(330, 'Fiş yazdırılıyor', font(22), MUTED)
    for i, col in enumerate(((30, 60, 160), (220, 70, 40), (0, 140, 200))):
        x = 34 + i * 62
        d.rounded_rectangle([x, 414, x + 48, 444], 7, fill=(235, 236, 240), outline=(210, 212, 218), width=2)
        d.ellipse([x + 17, 422, x + 31, 436], fill=col)
    return im


def pos_layer(state, out):
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    x0, y0, x1, y1 = POS_BOX
    panel = render_pos(state).resize((x1 - x0, y1 - y0), Image.LANCZOS)
    panel = ImageEnhance.Brightness(panel).enhance(0.96)
    layer.alpha_composite(panel, (x0, y0))
    layer.save(out)
    return out


# ---------------------------------------------------------------- scene 1: approach + plate detection
seg_alpr = WORK / 'seg_alpr.mp4'
ffmpeg('-i', R / 'ilkvideo.mp4', '-vf',
       f'crop=1760:990:80:0,scale={W}:{H}:flags=lanczos,tpad=stop_mode=clone:stop_duration={S1_HOLD},{GRADE},format=yuv420p',
       '-r', FPS, *INTER, seg_alpr)

# ---------------------------------------------------------------- scene 2: payment -> barrier -> exit
S2 = ensure(WORK / 's2')
ensure(S2 / 'in')
ffmpeg('-i', R / 'kullanclaude.mp4', '-vf', f'delogo=x=1664:y=990:w=240:h=70,scale={W}:{H}:flags=lanczos', S2 / 'in' / 'f%04d.png')
run([LIFT, S2 / 'in', S2 / 'mask'])
n2 = len(list((S2 / 'in').glob('f*.png')))
due = screen_layer('due', WORK / 'screen_due.png')
paid = screen_layer('paid', WORK / 'screen_paid.png')
pos_due = pos_layer('due', WORK / 'pos_due.png')
pos_paid = pos_layer('paid', WORK / 'pos_paid.png')
seg_gate = WORK / 'seg_gate.mp4'
fc = (f'[0:v]format=rgb24,split=2[base][carsrc];'
      f'[carsrc][1:v]alphamerge[car];'
      f"[base][2:v]overlay=shortest=1:enable='lt(t,{PAID_AT})'[a];"
      f"[a][3:v]overlay=shortest=1:enable='gte(t,{PAID_AT})'[b];"
      f"[b][4:v]overlay=shortest=1:enable='lt(t,{POS_AT})'[c];"
      f"[c][5:v]overlay=shortest=1:enable='gte(t,{POS_AT})'[d];"
      f'[d][car]overlay=shortest=1,{GRADE},format=yuv420p[out]')
ffmpeg('-framerate', FPS, '-start_number', 1, '-i', S2 / 'in' / 'f%04d.png',
       '-framerate', FPS, '-start_number', 1, '-i', S2 / 'mask' / 'f%04d.png',
       '-loop', 1, '-framerate', FPS, '-i', due, '-loop', 1, '-framerate', FPS, '-i', paid,
       '-loop', 1, '-framerate', FPS, '-i', pos_due, '-loop', 1, '-framerate', FPS, '-i', pos_paid,
       '-filter_complex', fc, '-map', '[out]', '-frames:v', n2, '-r', FPS, *INTER, seg_gate)

# ---------------------------------------------------------------- loop seam: dissolve into the first frame of scene 1
first = WORK / 'first.png'
ffmpeg('-i', seg_alpr, '-frames:v', 1, first)
seg_loop = WORK / 'seg_loop.mp4'
ffmpeg('-loop', 1, '-framerate', FPS, '-i', first, '-t', 0.5, '-vf', 'format=yuv420p', '-r', FPS, *INTER, seg_loop)

# ---------------------------------------------------------------- assemble
segs = [('alpr', seg_alpr), ('gate', seg_gate), ('loop', seg_loop)]
inputs, durs = [], []
for _, p in segs:
    inputs += ['-i', p]
    durs.append(frames_of(p) / FPS)
fc = ''.join(f'[{i}:v]fps={FPS},setsar=1,settb=AVTB[s{i}];' for i in range(len(segs)))
prev, offset, starts = '[s0]', 0.0, [0.0]
for i in range(1, len(segs)):
    offset += durs[i - 1] - XF
    starts.append(offset)
    fc += f'{prev}[s{i}]xfade=transition=fade:duration={XF}:offset={offset:.4f}[v{i}];'
    prev = f'[v{i}]'
fc += f'{prev}format=yuv420p[out]'
master = WORK / 'hero-master.mp4'
ffmpeg(*inputs, '-filter_complex', fc, '-map', '[out]', '-r', FPS, '-c:v', 'libx264', '-crf', '12', '-preset', 'veryfast',
       '-pix_fmt', 'yuv420p', '-an', master)

total = sum(durs) - XF * (len(segs) - 1)
timeline = {
    'fps': FPS, 'xfade': XF, 'total': round(total, 3), 'paidAtInGate': PAID_AT, 'posApprovedAtInGate': POS_AT,
    'segments': [{'name': n, 'xfadeStart': round(s, 3), 'fullyIn': round(s + (XF if i else 0), 3), 'duration': round(d, 3)}
                 for i, ((n, _), s, d) in enumerate(zip(segs, starts, durs))],
}
(OUT / 'timeline.json').write_text(json.dumps(timeline, indent=2))
print(json.dumps(timeline, indent=2), flush=True)

# ---------------------------------------------------------------- deliverables (2-pass ABR)
DENOISE = 'hqdn3d=1.2:1.2:4:4'
common = ['-profile:v', 'high', '-level', '4.1', '-pix_fmt', 'yuv420p', '-g', '48', '-keyint_min', '24', '-an']


def x264_two_pass(src, out, bitrate, maxrate, bufsize, vf):
    log = str(WORK / f'passlog-{out.stem}')
    base = ['-i', src, '-vf', vf, '-c:v', 'libx264', '-preset', 'slow', '-b:v', bitrate, '-maxrate', maxrate,
            '-bufsize', bufsize, *common, '-passlogfile', log]
    ffmpeg(*base, '-pass', '1', '-f', 'null', '/dev/null')
    ffmpeg(*base, '-pass', '2', '-movflags', '+faststart', out)


x264_two_pass(master, OUT / 'hero-1080.mp4', '2000k', '3000k', '6000k', DENOISE)
x264_two_pass(master, OUT / 'hero-720.mp4', '950k', '1500k', '3000k', f'{DENOISE},scale=1280:720:flags=lanczos')

# poster: plaka doğrulandı karesi
poster_png = WORK / 'poster.png'
ffmpeg('-ss', f'{durs[0] - S1_HOLD - 0.15:.3f}', '-i', master, '-frames:v', 1, poster_png)
poster = Image.open(poster_png).convert('RGB')
poster.save(OUT / 'poster.webp', quality=82, method=6)
poster.save(OUT / 'poster.jpg', quality=86, optimize=True, progressive=True)
ffmpeg('-i', OUT / 'hero-1080.mp4', '-vf', 'fps=2,scale=384:-1,tile=6x4', '-frames:v', 1, WORK / 'sheet.png')

vp9_log = str(WORK / 'passlog-vp9')
vp9 = ['-i', master, '-vf', DENOISE, '-c:v', 'libvpx-vp9', '-b:v', '1500k', '-maxrate', '2400k', '-bufsize', '4800k',
       '-deadline', 'good', '-row-mt', '1', '-g', '48', '-pix_fmt', 'yuv420p', '-an', '-passlogfile', vp9_log]
ffmpeg(*vp9, '-pass', '1', '-cpu-used', '4', '-f', 'null', '/dev/null')
ffmpeg(*vp9, '-pass', '2', '-cpu-used', '2', OUT / 'hero-1080.webm')
print('DONE ->', OUT, '| ara dosyalar:', WORK, flush=True)
