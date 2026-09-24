
import type { ReactNode, SVGProps } from 'react'

export type IconProps = Omit<SVGProps<SVGSVGElement>, 'children' | 'viewBox' | 'fill' | 'stroke'>

function Svg({ children, ...rest }: IconProps & { children: ReactNode }) {
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
      {...rest}
    >
      {children}
    </svg>
  )
}

export function CameraIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4.5 7.5h3.2l1.3-2.5h6l1.3 2.5h3.2A1.5 1.5 0 0 1 21 9v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18V9a1.5 1.5 0 0 1 1.5-1.5Z" />
      <circle cx="12" cy="13.3" r="3.4" />
      <path d="M17.6 10.4h.01" strokeWidth="2.2" />
    </Svg>
  )
}

export function PlateIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="2.5" y="7" width="19" height="10" rx="1.6" />
      <path d="M6.3 7v10M10 10.5h7.5M10 13.5h5" />
    </Svg>
  )
}

export function KioskIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="7" y="2.5" width="10" height="17" rx="1.6" />
      <rect x="9.2" y="5" width="5.6" height="4.6" rx="0.7" />
      <path d="M9.2 13h5.6M9.2 15.6h3.4M5 21.5h14" />
    </Svg>
  )
}

export function BarrierIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3.5 21.5h5M6 21.5V6.8" />
      <rect x="6" y="8.2" width="15.5" height="3.2" rx="1.1" />
      <path d="M10.4 8.2v3.2M14.3 8.2v3.2M18.2 8.2v3.2" />
    </Svg>
  )
}

export function CardIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="M2.5 9.6h19M6 15h4" />
      <path d="M15.2 13.3a2.6 2.6 0 0 1 0 3.4M17.3 12a5 5 0 0 1 0 6" />
    </Svg>
  )
}

export function PhoneIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="7" y="2.5" width="10" height="19" rx="2" />
      <path d="M10.6 5.6h2.8M12 18.4h.01" strokeWidth="2.2" />
    </Svg>
  )
}

export function CloudIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M7.2 18.5h10.3a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.5 9.5a4.5 4.5 0 0 0 .7 9Z" />
      <path d="M12 12v5M9.6 14.4 12 12l2.4 2.4" />
    </Svg>
  )
}

export function ChartIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3.5 20.5h17" />
      <path d="M6.5 16.5v-4.5M11 16.5V7M15.5 16.5v-6M20 16.5V4.5" />
    </Svg>
  )
}

export function ReportIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6.5 2.5h7l5 5v12a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2v-15a2 2 0 0 1 2-2Z" />
      <path d="M13.5 2.5v5h5" />
      <path d="M8.8 17v-3M12 17v-5.5M15.2 17v-4" />
    </Svg>
  )
}

export function ShieldIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 2.5 4.5 5.3v6c0 4.7 3.2 8.4 7.5 10.2 4.3-1.8 7.5-5.5 7.5-10.2v-6L12 2.5Z" />
      <path d="m8.8 12.1 2.3 2.3 4.4-4.6" />
    </Svg>
  )
}

export function ClockIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.2 2" />
    </Svg>
  )
}

export function MapIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m3.5 6.2 5.5-2.5 6 2.5 5.5-2.5v14.1l-5.5 2.5-6-2.5-5.5 2.5V6.2Z" />
      <path d="M9 3.7v14.1M15 6.2v14.1" />
    </Svg>
  )
}

export function UsersIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 4.7a3.5 3.5 0 0 1 0 6.6M17.6 13.7a6.5 6.5 0 0 1 3.9 6.3" />
    </Svg>
  )
}

export function InvoiceIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 2.5h12v19l-2.4-1.5-2.4 1.5-2.4-1.5L8.4 21.5 6 20V2.5Z" />
      <path d="M9 7.5h6M9 11h6M9 14.5h3.5" />
    </Svg>
  )
}

export function SupportIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4.5 13v-1a7.5 7.5 0 0 1 15 0v1" />
      <rect x="3" y="12" width="4" height="6" rx="1.5" />
      <rect x="17" y="12" width="4" height="6" rx="1.5" />
      <path d="M19 18v1a2.5 2.5 0 0 1-2.5 2.5H13" />
    </Svg>
  )
}

export function SettingsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 7h9.5M18.5 7H20M4 12h2.5M11.5 12H20M4 17h11.5M20.5 17H20" />
      <circle cx="16" cy="7" r="2.2" />
      <circle cx="9" cy="12" r="2.2" />
      <circle cx="18" cy="17" r="2.2" />
    </Svg>
  )
}

const icons = {
  camera: CameraIcon,
  plate: PlateIcon,
  kiosk: KioskIcon,
  barrier: BarrierIcon,
  card: CardIcon,
  phone: PhoneIcon,
  cloud: CloudIcon,
  chart: ChartIcon,
  report: ReportIcon,
  shield: ShieldIcon,
  clock: ClockIcon,
  map: MapIcon,
  users: UsersIcon,
  invoice: InvoiceIcon,
  support: SupportIcon,
  settings: SettingsIcon,
}

export type FeatureIconName = keyof typeof icons

export function FeatureIcon({ name, ...rest }: IconProps & { name: FeatureIconName }) {
  const Icon = icons[name]
  return <Icon {...rest} />
}
