import { createElement, useEffect } from 'react'
import styles from './PartnerPanelTour.module.css'

// Port of visiosoft.com.tr lib/three/panel-tour.js (<vs-panel-tour>, the interactive PARKBIZ Partner panel tour with sample data).
// `bare` renders only the panel, scaled into this box, so it fits the site's own laptop mockup.
export default function PartnerPanelTour() {
  useEffect(() => {
    void import('./panel-tour.js')
  }, [])

  return createElement('vs-panel-tour', { lang: 'tr', bare: '', class: styles.tour })
}
