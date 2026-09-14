import type { HardwareSlug } from '../../HardwareProduct/products.ts'
import type { ProductDetailData } from '../detailTypes.ts'
import { kameraMontajKulesiDetail } from './kameraMontajKulesi.ts'
import { kameraMuhafazaDetail } from './kameraMuhafaza.ts'
import { kioskDetail } from './kiosk.ts'
import { ledPanelDetail } from './ledPanel.ts'
import { rackKabinDetail } from './rackKabin.ts'
import { tirKioskDetail } from './tirKiosk.ts'
import { togerboxDetail, visioboxDetail } from './visiobox.ts'

/** Sekiz donanım ürününün detay verisi. */
export const productDetails: Record<HardwareSlug, ProductDetailData> = {
  kiosk: kioskDetail,
  'tir-kiosk': tirKioskDetail,
  visiobox: visioboxDetail,
  'rack-kabin': rackKabinDetail,
  'kamera-muhafaza': kameraMuhafazaDetail,
  'kamera-montaj-kulesi': kameraMontajKulesiDetail,
  'ledli-reklam-paneli': ledPanelDetail,
  togerbox: togerboxDetail,
}

export type ProductDetailSlug = HardwareSlug
