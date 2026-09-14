import KioskZoom from '../../components/KioskZoom/index.ts'
import ProductZoom from '../../components/ProductZoom/index.ts'
import ZoomCallouts from './ZoomCallouts.tsx'
import ZoomGallery from './ZoomGallery.tsx'
import type { DetailZoom as DetailZoomData } from './detailTypes.ts'

type DetailZoomProps = {
  zoom: DetailZoomData
}

/**
 * Hareket azaltıldığında yakınlaşma yoktur; "Kaydırdıkça … yaklaşın." girişini kaydırmadan söz etmeyen
 * "… yakından bakın." biçimine çevirir (yönelme hâli iki fiilde de aynı kalır).
 */
const staticLeadOf = (description: string) => {
  const match = /^Kaydırdıkça\s+(.+?)\s+yaklaşın\.$/u.exec(description)
  if (!match) return undefined
  const parts = match[1]
  return `${parts.charAt(0).toLocaleUpperCase('tr-TR')}${parts.slice(1)} yakından bakın.`
}

/**
 * Yakından inceleme bölümü: kioskta ürün fotoğrafı, çizimi olan ürünlerde teknik çizim üzerinde sabitlenmiş yakınlaşma,
 * diğerlerinde ürün görselleri ya da işaretli parça görünümü.
 */
export default function DetailZoom({ zoom }: DetailZoomProps) {
  switch (zoom.kind) {
    case 'kiosk':
      return <KioskZoom tone="light" />
    case 'drawing':
      return (
        <ProductZoom
          eyebrow={zoom.eyebrow}
          title={zoom.title}
          overview={zoom.overview}
          staticLead={staticLeadOf(zoom.overview.description)}
          image={zoom.image}
          details={zoom.details}
          tone="light"
          maxScale={2.2}
        />
      )
    case 'gallery':
      return <ZoomGallery zoom={zoom} />
    case 'callouts':
      return <ZoomCallouts zoom={zoom} />
  }
}
