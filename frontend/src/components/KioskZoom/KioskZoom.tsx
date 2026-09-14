import ProductZoom from '../ProductZoom/index.ts'
import { kioskScreenBox, kioskZoomCopy, kioskZoomDetails, kioskZoomImage } from '../../data/kioskZoom.ts'
import KioskScreen from './KioskScreen.tsx'

type KioskZoomProps = {
  tone?: 'light' | 'dark'
  /** Her durum için kaydırma uzunluğu (svh); verilmezse ProductZoom varsayılanı kullanılır. */
  frameLength?: number
}

/** Ana sayfa bölüm bağlantısı; diğer bölümlerdeki gibi sabit bir kimlik (/#yakindan-inceleyin). */
export const KIOSK_ZOOM_ID = 'yakindan-inceleyin'

/**
 * Kiosk için hazır yakınlaşma bölümü: ürün görseli, detay kareleri ve ekrandaki ödeme arayüzü.
 * ProductZoom bir `id` almadığı için sabit kimlik stilsiz bir sarmalayıcıda durur; yapışkan (sticky) düzeni etkilemez.
 */
export default function KioskZoom({ tone = 'light', frameLength }: KioskZoomProps) {
  return (
    <div id={KIOSK_ZOOM_ID}>
      <ProductZoom
        eyebrow={kioskZoomCopy.eyebrow}
        title={kioskZoomCopy.title}
        overview={kioskZoomCopy.overview}
        staticLead={kioskZoomCopy.staticLead}
        image={kioskZoomImage}
        details={kioskZoomDetails}
        overlays={[{ id: 'screen', box: kioskScreenBox, node: <KioskScreen /> }]}
        tone={tone}
        frameLength={frameLength}
        // 545 px genişliğindeki ana görsel yüksek piksel oranlı ekranlarda bulanıklaşmasın.
        sharpCap
      />
    </div>
  )
}
