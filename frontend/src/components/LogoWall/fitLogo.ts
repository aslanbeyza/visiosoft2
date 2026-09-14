/**
 * Logoyu optik alanına göre kutuya yerleştirir.
 * Görsel küçük bir tuvale çizilir; saydam ya da köşe rengindeki (beyaz/gri) boşluk ayıklanıp gerçek içerik kutusu bulunur.
 * İçerik, en-boy oranından bağımsız olarak aynı alanı kaplayacak biçimde ölçeklenir: kare amblemler daha uzun,
 * geniş yazı logoları daha geniş durur. Boşluk clip-path ile gizlenir. Aynı dosya bir kez ölçülür.
 * Açık renkli logolar: içerikteki koyu piksellerin ortalama parlaklığı ölçülür; gri katmana bu logoya özel bir gama
 * eğrisi (--logo-ink) verilir. Gama beyazı beyaz bırakır, yalnızca soluk çizgileri koyulaştırır; renkli katman değişmez.
 */

/** ink: içerikteki beyaz olmayan piksellerin ortalama parlaklığı (0 koyu, 1 beyaz). */
type Bounds = { ratio: number; x: number; y: number; w: number; h: number; ink: number }

/** Kutu 3:2; ölçüler kutu genişliği birimindedir. */
const BOX_RATIO = 3 / 2
/** Hedef içerik alanı (kutu genişliğinin karesi cinsinden). */
const AREA = 0.115
const MAX_W = 0.78
/** Kutu yüksekliğinin en fazla bu oranı. */
const MAX_H = 0.62
const SAMPLE = 96
/** Bu parlaklığın üstündeki pikseller beyaz sayılır (amblem içleri); mürekkep ortalamasına katılmaz. */
const WHITE = 0.86
/** Hedef mürekkep parlaklığı; ince çizgili, kenar yumuşatmalı logolar da Bakırköy Belediyesi, Hilton kadar net okunsun. */
const INK_TARGET = 0.34
/** Gama basamakları (×100); her biri için bir SVG süzgeci tanımlanır. */
const GAMMA_STEPS = [125, 150, 175, 200, 225, 250, 275, 300]
const FILTER_PREFIX = 'logo-wall-ink-'
const cache = new Map<string, Bounds>()

const pct = (value: number) => `${(value * 100).toFixed(3)}%`

/** Gama süzgeçleri belgeye bir kez eklenir; tüm LogoWall'lar aynı tanımları kullanır. */
function ensureInkFilters() {
  if (document.getElementById(`${FILTER_PREFIX}defs`)) return
  const ns = 'http://www.w3.org/2000/svg'
  const svg = document.createElementNS(ns, 'svg')
  svg.id = `${FILTER_PREFIX}defs`
  svg.setAttribute('aria-hidden', 'true')
  svg.setAttribute('focusable', 'false')
  svg.setAttribute('width', '0')
  svg.setAttribute('height', '0')
  svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none'
  for (const step of GAMMA_STEPS) {
    const filter = document.createElementNS(ns, 'filter')
    filter.id = `${FILTER_PREFIX}${step}`
    // Gama sRGB değerlerine uygulanır; doğrusal uzayda beklenenden koyu sonuç verirdi.
    filter.setAttribute('color-interpolation-filters', 'sRGB')
    const transfer = document.createElementNS(ns, 'feComponentTransfer')
    for (const channel of ['feFuncR', 'feFuncG', 'feFuncB']) {
      const func = document.createElementNS(ns, channel)
      func.setAttribute('type', 'gamma')
      func.setAttribute('exponent', String(step / 100))
      transfer.appendChild(func)
    }
    // İnce çizgiler kenar yumuşatmasında yarı saydam kalır; saydamlığa daha hafif bir eğri (0 ve 1 değişmez) çizgiyi belirginleştirir.
    const alpha = document.createElementNS(ns, 'feFuncA')
    alpha.setAttribute('type', 'gamma')
    alpha.setAttribute('exponent', (1 / Math.sqrt(step / 100)).toFixed(2))
    transfer.appendChild(alpha)
    filter.appendChild(transfer)
    svg.appendChild(filter)
  }
  document.body.appendChild(svg)
}

/** Mürekkep ortalamasını hedefe indiren gama, en yakın basamağa yuvarlanır; koyu logolarda süzgeç yok. */
function inkFilter(ink: number): string | null {
  if (!(ink > INK_TARGET) || ink >= 1) return null
  const gamma = Math.log(INK_TARGET) / Math.log(ink)
  const step = Math.round((gamma * 100) / 25) * 25
  if (step < GAMMA_STEPS[0]) return null
  return `url(#${FILTER_PREFIX}${Math.min(step, GAMMA_STEPS[GAMMA_STEPS.length - 1])})`
}

function measure(img: HTMLImageElement): Bounds | null {
  const key = img.currentSrc || img.src
  const hit = cache.get(key)
  if (hit) return hit
  const nw = img.naturalWidth
  const nh = img.naturalHeight
  if (!nw || !nh) return null

  let bounds: Bounds = { ratio: nw / nh, x: 0, y: 0, w: 1, h: 1, ink: 0 }
  try {
    const scale = SAMPLE / Math.max(nw, nh)
    const cw = Math.max(1, Math.round(nw * scale))
    const ch = Math.max(1, Math.round(nh * scale))
    const canvas = document.createElement('canvas')
    canvas.width = cw
    canvas.height = ch
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (ctx) {
      ctx.drawImage(img, 0, 0, cw, ch)
      const { data } = ctx.getImageData(0, 0, cw, ch)
      const at = (px: number, py: number) => (py * cw + px) * 4
      const corners = [at(0, 0), at(cw - 1, 0), at(0, ch - 1), at(cw - 1, ch - 1)]
      const diff = (a: number, b: number) => Math.abs(data[a] - data[b]) + Math.abs(data[a + 1] - data[b + 1]) + Math.abs(data[a + 2] - data[b + 2])
      // Dört köşe de opak ve aynı renkteyse zemin odur (beyaz ya da gri fon).
      const solid = corners.every((c) => data[c + 3] > 240 && diff(c, corners[0]) < 30)
      let minX = cw
      let minY = ch
      let maxX = -1
      let maxY = -1
      let inkSum = 0
      let inkWeight = 0
      for (let py = 0; py < ch; py++) {
        for (let px = 0; px < cw; px++) {
          const i = at(px, py)
          if (data[i + 3] < 28) continue
          if (solid && diff(i, corners[0]) < 48) continue
          // Gri katmanın göreceği parlaklık (grayscale ağırlıkları); yarı saydam kenarlar opaklıkları oranında sayılır.
          const lum = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255
          if (lum < WHITE) {
            const alpha = data[i + 3] / 255
            inkSum += lum * alpha
            inkWeight += alpha
          }
          if (px < minX) minX = px
          if (px > maxX) maxX = px
          if (py < minY) minY = py
          if (py > maxY) maxY = py
        }
      }
      if (maxX >= minX && maxY >= minY) {
        const w = (maxX - minX + 1) / cw
        const h = (maxY - minY + 1) / ch
        bounds = { ratio: (w * nw) / (h * nh), x: minX / cw, y: minY / ch, w, h, ink: inkWeight ? inkSum / inkWeight : 0 }
      }
    }
  } catch {
    // Başka kökenden gelen görsel tuvali kirletir; tüm dosya içerik sayılır.
  }
  cache.set(key, bounds)
  return bounds
}

/** Yüklenen logonun kapsayıcısına (img.parentElement) konum, boyut ve kırpma yazar. */
export function fitLogo(img: HTMLImageElement) {
  const art = img.parentElement
  if (!art || art.dataset.fit === 'area') return
  const b = measure(img)
  if (!b) return

  const boxH = 1 / BOX_RATIO
  let w = Math.sqrt(AREA * b.ratio)
  let h = w / b.ratio
  if (w > MAX_W) {
    w = MAX_W
    h = w / b.ratio
  }
  if (h > MAX_H * boxH) {
    h = MAX_H * boxH
    w = h * b.ratio
  }
  // Görselin tamamı: içerik kutusu w×h olacak biçimde büyütülür ve içerik merkezi kutunun ortasına gelir.
  const iw = w / b.w
  const ih = h / b.h
  const left = 0.5 - (b.x + b.w / 2) * iw
  const top = boxH / 2 - (b.y + b.h / 2) * ih

  art.style.inset = 'auto'
  art.style.left = pct(left)
  art.style.top = pct(top / boxH)
  art.style.width = pct(iw)
  art.style.height = pct(ih / boxH)
  art.style.clipPath = `inset(${pct(b.y)} ${pct(1 - b.x - b.w)} ${pct(1 - b.y - b.h)} ${pct(b.x)})`
  const ink = inkFilter(b.ink)
  if (ink) {
    // Süzgeç tanımı değişkenden önce eklenir; olmayan bir url() başvurusu logoyu bazı tarayıcılarda gizleyebilir.
    ensureInkFilters()
    art.style.setProperty('--logo-ink', ink)
  }
  art.dataset.fit = 'area'
}
