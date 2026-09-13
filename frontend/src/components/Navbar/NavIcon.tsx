import type { ReactNode } from 'react'
import type { NavIcon as NavIconName } from '../../data/siteNav.ts'

export type GlyphName = NavIconName | 'chevron' | 'arrow' | 'mail' | 'chat'

const glyphs: Record<GlyphName, ReactNode> = {
  cloud: <path d="M7 18.5a4 4 0 0 1-.6-7.96 5.5 5.5 0 0 1 10.73-.54A4.25 4.25 0 0 1 17 18.5Z" />,
  code: <path d="m8.5 8-4 4 4 4M15.5 8l4 4-4 4M13.25 5.5l-2.5 13" />,
  network: (
    <>
      <circle cx="12" cy="12" r="2.5" />
      <circle cx="5" cy="5" r="2" />
      <circle cx="19" cy="5" r="2" />
      <circle cx="5" cy="19" r="2" />
      <circle cx="19" cy="19" r="2" />
      <path d="m6.5 6.5 3.7 3.7M17.5 6.5l-3.7 3.7M6.5 17.5l3.7-3.7M17.5 17.5l-3.7-3.7" />
    </>
  ),
  street: <path d="M6 20.5 9.5 3.5M18 20.5l-3.5-17M12 5.5v2.25M12 11v2.25M12 16.5v2.5" />,
  building: (
    <path d="M3.5 20.5h17M6 20.5V5a1.5 1.5 0 0 1 1.5-1.5h9A1.5 1.5 0 0 1 18 5v15.5M9.5 7.5h1M13.5 7.5h1M9.5 11h1M13.5 11h1M10.25 20.5V16h3.5v4.5" />
  ),
  ticket: (
    <>
      <path d="M3.5 8A1.5 1.5 0 0 1 5 6.5h14A1.5 1.5 0 0 1 20.5 8v2a2 2 0 0 0 0 4v2a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 16v-2a2 2 0 0 0 0-4Z" />
      <path d="M14.5 6.5v2M14.5 11v2M14.5 15.5v2" />
    </>
  ),
  hgs: (
    <>
      <rect x="4.5" y="11" width="15" height="8.5" rx="1.5" />
      <path d="M8 15.25h8M8.75 7.75a4.6 4.6 0 0 1 6.5 0M6.25 5.25a8.1 8.1 0 0 1 11.5 0" />
    </>
  ),
  eye: <path d="m9 4.5-5.5 2v13l5.5-2 6 2 5.5-2v-13l-5.5 2-6-2ZM9 4.5v13M15 6.5v13" />,
  led: (
    <>
      <rect x="3.5" y="4" width="17" height="11.5" rx="1.5" />
      <path d="M12 15.5V20M8.5 20h7M7 8h4M7 11.5h6.5" />
    </>
  ),
  report: <path d="M4 20h16M7 16.5v-5M12 16.5V7M17 16.5v-8" />,
  chevron: <path d="m6.5 9.5 5.5 5.5 5.5-5.5" />,
  arrow: <path d="M5 12h14M13.5 6.5 19 12l-5.5 5.5" />,
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  chat: <path d="M20.5 11.75a8.25 8.25 0 0 1-12.2 7.24L3.5 20.5l1.55-4.6A8.25 8.25 0 1 1 20.5 11.75Z" />,
}

type NavIconProps = {
  name: GlyphName
  className?: string
}

/** Navbar'daki tüm çizgi ikonlar: 24'lük ızgara, 1.6 kalınlık, currentColor. */
export default function NavIcon({ name, className }: NavIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {glyphs[name]}
    </svg>
  )
}

/** Ürün fotoğrafı olmayan LED panel için sahne çizimi (dikey panel ve ayak). */
export function LedPanelArt({ className }: { className?: string }) {
  const stroke = { vectorEffect: 'non-scaling-stroke' } as const
  return (
    <svg
      viewBox="0 0 64 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect x="25" y="4" width="14" height="36" rx="1.5" style={stroke} />
      <path d="M28.5 10h7M28.5 15h4.5M28.5 20h7M28.5 25h3.5M28.5 30h7" style={stroke} />
      <path d="M29 40v4M35 40v4M23 44h18" style={stroke} />
    </svg>
  )
}
