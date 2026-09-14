import type { SVGProps } from 'react'
import type { AdvantageIconName, MethodIconName, SectorIconName } from './hgsPageCopy.ts'

type IconName = SectorIconName | MethodIconName | AdvantageIconName

/* 24px ızgara, 1,6 çizgi; FeatureGrid simgeleriyle aynı dil. */
const paths: Record<IconName, string[]> = {
  hgs: ['M4 14.5a8 8 0 0 1 16 0', 'M7.5 14.5a4.5 4.5 0 0 1 9 0', 'M12 14.5h.01', 'M5 19h14'],
  card: ['M3.5 6.5h17v11h-17z', 'M3.5 10h17', 'M7 14.5h3'],
  qr: ['M4 4h6v6H4z', 'M14 4h6v6h-6z', 'M4 14h6v6H4z', 'M14 14h2.5v2.5H14z', 'M17.5 17.5H20V20h-2.5z'],
  building: ['M5 20.5V5.5l7-2.5 7 2.5v15', 'M3.5 20.5h17', 'M9.5 20.5v-4h5v4', 'M9 8.5h.01M15 8.5h.01M9 12.5h.01M15 12.5h.01'],
  gauge: ['M4.2 16.5a8.5 8.5 0 1 1 15.6 0', 'M12 13.5l4-3.5', 'M12 13.5h.01'],
  users: ['M15.5 20v-1.5a3.5 3.5 0 0 0-3.5-3.5H7a3.5 3.5 0 0 0-3.5 3.5V20', 'M9.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z', 'M20.5 20v-1.5a3.5 3.5 0 0 0-2.5-3.35', 'M15.5 4.2a3.5 3.5 0 0 1 0 6.6'],
  shield: ['M12 3.5 5 6.5v5.2c0 4.3 3 7.2 7 8.8 4-1.6 7-4.5 7-8.8V6.5z', 'm9 12 2.2 2.2L15.5 10'],
  chart: ['M4 4v16h16', 'M8 16v-4', 'M12 16V8', 'M16 16v-6'],
  mall: ['M4 10h16v10.5H4z', 'M2.5 10 12 3.5l9.5 6.5', 'M9.5 20.5v-5h5v5'],
  home: ['M4 11 12 4l8 7', 'M6 9.5v11h12v-11', 'M10 20.5v-5h4v5'],
  hospital: ['M4 20.5V7.5h16v13', 'M2.5 20.5h19', 'M12 10v5M9.5 12.5h5'],
  city: ['M3.5 20.5V10h6v10.5', 'M9.5 20.5V4h11v16.5', 'M13 8h4M13 11.5h4M13 15h4', 'M2 20.5h20'],
  brief: ['M3.5 8h17v11.5h-17z', 'M9 8V5.5h6V8', 'M3.5 13h17'],
  truck: ['M2.5 6.5h11v9.5h-11z', 'M13.5 10h4.5l3 3.5V16h-7.5', 'M6.5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z', 'M17.5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'],
}

export default function HgsIcon({ name, ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {paths[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}
