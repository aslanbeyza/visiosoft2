import type { ReactNode } from 'react'

type IconProps = { className?: string }

function Svg({ className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export function ChartIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4 19V5M4 19h16" />
      <path d="M8 15v-4M12 15V8M16 15v-7" />
    </Svg>
  )
}

export function ShieldIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M12 3l8 3v6c0 5-3.4 8.4-8 9-4.6-.6-8-4-8-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </Svg>
  )
}

export function CoinIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7v10M9.5 9.5c.6-1 1.5-1.5 2.5-1.5s2 .6 2 1.8-1 1.7-2.4 2.1c-1.5.4-2.6 1-2.6 2.3S10.4 16 12 16s2.3-.5 2.7-1.4" />
    </Svg>
  )
}

export function ScanIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M7 4H5a1 1 0 0 0-1 1v2M17 4h2a1 1 0 0 1 1 1v2M7 20H5a1 1 0 0 1-1-1v-2M17 20h2a1 1 0 0 0 1-1v-2M4 12h16" />
    </Svg>
  )
}

export function BellIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M6 9a6 6 0 1 1 12 0c0 7 2 7 2 7H4s2 0 2-7" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </Svg>
  )
}

export function CardIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18" />
    </Svg>
  )
}

export function PlateIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="3" y="7" width="18" height="10" rx="2" />
      <path d="M7 12h.01M11 12h2M16 12h.01" />
    </Svg>
  )
}

export function GateIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4 20V6l8-3 8 3v14" />
      <path d="M4 12h16" />
    </Svg>
  )
}

export function HubIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 5v2M12 17v2M5 12H7M17 12h2M7.2 7.2l1.4 1.4M15.4 15.4l1.4 1.4M16.8 7.2l-1.4 1.4M8.6 15.4l-1.4 1.4" />
    </Svg>
  )
}
