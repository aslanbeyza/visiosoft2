import type { HardwareSlug } from '../HardwareProduct/products.ts'

const MODEL_DIR = '/models/products'

/**
 * Canlı sitedeki donanım modelleri (visiosoft.com.tr model-viewer kaynakları).
 * Dosyalar sercan-mostafa vitrinindeki meshopt sıkıştırmasıdır; gövde aynıdır.
 * Togerbox ayrı bir gövde değildir, Visiobox modeli kullanılır.
 */
const modelFile: Partial<Record<HardwareSlug, string>> = {
  kiosk: 'kiosk.glb',
  'tir-kiosk': 'tir-kiosk.glb',
  visiobox: 'visiobox.glb',
  togerbox: 'visiobox.glb',
  'rack-kabin': 'rack-kabin.glb',
  'kamera-muhafaza': 'kamera-muhafaza.glb',
  'kamera-montaj-kulesi': 'kamera-montaj-kulesi.glb',
  'ledli-reklam-paneli': 'ledli-reklam-paneli.glb',
}

export function productModelSrc(slug: HardwareSlug): string | undefined {
  const file = modelFile[slug]
  return file ? `${MODEL_DIR}/${file}` : undefined
}
