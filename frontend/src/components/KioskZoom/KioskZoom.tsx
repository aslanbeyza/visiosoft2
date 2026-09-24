import ProductZoom from '../ProductZoom/index.ts'
import { kioskScreenBox, kioskZoomCopy, kioskZoomDetails, kioskZoomImage } from '../../data/kioskZoom.ts'
import KioskScreen from './KioskScreen.tsx'

type KioskZoomProps = {
  tone?: 'light' | 'dark'

  frameLength?: number
}

export const KIOSK_ZOOM_ID = 'yakindan-inceleyin'

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

        sharpCap
      />
    </div>
  )
}
