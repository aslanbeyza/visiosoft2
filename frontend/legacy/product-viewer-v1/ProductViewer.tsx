import { createElement } from 'react'
import styles from './ProductViewer.module.css'

type ProductViewerProps = {
  src: string
  poster?: string
  className?: string
  autoRotate?: boolean
}

export default function ProductViewer({
  src,
  poster,
  className = '',
  autoRotate = true,
}: ProductViewerProps) {
  return createElement('model-viewer', {
    src,
    poster,
    className: `${styles.viewer} ${className}`.trim(),
    'camera-controls': true,
    'touch-action': 'pan-y',
    'auto-rotate': autoRotate,
    'rotation-per-second': '12deg',
    'tone-mapping': 'neutral',
    'environment-image': 'neutral',
    exposure: '1.05',
    'shadow-intensity': '0.7',
    'shadow-softness': '0.85',
    'interaction-prompt': 'auto',
    'disable-zoom': false,
    ar: true,
    'ar-modes': 'webxr scene-viewer quick-look',
  })
}
