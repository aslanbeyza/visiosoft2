import type { DetailedHTMLProps, HTMLAttributes } from 'react'

type ModelViewerProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
  src?: string
  poster?: string
  ar?: boolean
  exposure?: string
  'camera-controls'?: boolean
  'touch-action'?: string
  'auto-rotate'?: boolean
  'rotation-per-second'?: string
  'tone-mapping'?: string
  'environment-image'?: string
  'shadow-intensity'?: string
  'shadow-softness'?: string
  'interaction-prompt'?: string
  'disable-zoom'?: boolean
  'ar-modes'?: string
}

declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': ModelViewerProps
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': ModelViewerProps
    }
  }
}
