import { createElement, useEffect } from 'react'

type Props = {
  lang?: 'tr' | 'en'
}

// Port of visiosoft.com.tr lib/three/visio-guide.js: importing it defines the <vs-guide> custom element
// ("Visi", a scripted product guide with WhatsApp/phone links). It only appears once the page scrolls past [data-hero].
export default function VisiGuide({ lang = 'tr' }: Props) {
  useEffect(() => {
    void import('./visio-guide.js')
  }, [])

  return createElement('vs-guide', { lang })
}
