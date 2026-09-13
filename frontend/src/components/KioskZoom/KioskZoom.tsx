import ProductZoom from '../ProductZoom/index.ts'
import { kioskScreenBox, kioskZoomCopy, kioskZoomDetails, kioskZoomImage } from '../../data/kioskZoom.ts'
import KioskScreen from './KioskScreen.tsx'

type KioskZoomProps = {
  tone?: 'light' | 'dark'
}

/** Kiosk için hazır yakınlaşma bölümü: ürün görseli, detay kareleri ve ekrandaki ödeme arayüzü. */
export default function KioskZoom({ tone = 'light' }: KioskZoomProps) {
  return (
    <ProductZoom
      eyebrow={kioskZoomCopy.eyebrow}
      title={kioskZoomCopy.title}
      overview={kioskZoomCopy.overview}
      image={kioskZoomImage}
      details={kioskZoomDetails}
      overlays={[{ id: 'screen', box: kioskScreenBox, node: <KioskScreen /> }]}
      tone={tone}
    />
  )
}
