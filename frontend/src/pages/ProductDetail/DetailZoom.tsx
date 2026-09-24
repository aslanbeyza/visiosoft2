import KioskZoom from '../../components/KioskZoom/index.ts'
import ProductZoom from '../../components/ProductZoom/index.ts'
import ZoomCallouts from './ZoomCallouts.tsx'
import ZoomGallery from './ZoomGallery.tsx'
import type { DetailZoom as DetailZoomData } from './detailTypes.ts'

type DetailZoomProps = {
  zoom: DetailZoomData
}

const staticLeadOf = (description: string) => {
  const match = /^Kaydırdıkça\s+(.+?)\s+yaklaşın\.$/u.exec(description)
  if (!match) return undefined
  const parts = match[1]
  return `${parts.charAt(0).toLocaleUpperCase('tr-TR')}${parts.slice(1)} yakından bakın.`
}

export default function DetailZoom({ zoom }: DetailZoomProps) {
  switch (zoom.kind) {
    case 'kiosk':
      return <KioskZoom tone="light" frameLength={45} />
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
