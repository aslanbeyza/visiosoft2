import type { ReactNode, SVGProps } from 'react'

type IconProps = Omit<SVGProps<SVGSVGElement>, 'children' | 'viewBox' | 'fill' | 'stroke'>

function Svg({ children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

export function SpeedIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4.5 16.5a8 8 0 1 1 15 0" />
      <path d="M12 12.5 16 8.5" />
      <circle cx="12" cy="12.5" r="1.2" />
      <path d="M8 19.5h8" />
    </Svg>
  )
}

export function ChipIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="7" y="7" width="10" height="10" rx="1.5" />
      <path d="M10 10h4v4h-4z" />
      <path d="M9.5 3.5V7M14.5 3.5V7M9.5 17v3.5M14.5 17v3.5M3.5 9.5H7M3.5 14.5H7M17 9.5h3.5M17 14.5h3.5" />
    </Svg>
  )
}

export function LeafIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M19.5 4.5c-9 .5-14 5-14 11a4 4 0 0 0 4 4c6 0 10-5 10-15Z" />
      <path d="M5 20c3-4.5 6-7.5 10-10" />
    </Svg>
  )
}

export function WeatherIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M7 15.5a4 4 0 0 1-.4-8 5.5 5.5 0 0 1 10.6 1.4A3.3 3.3 0 0 1 17 15.5Z" />
      <path d="M8.5 18.5 7.5 21M12.5 18.5l-1 2.5M16.5 18.5l-1 2.5" />
    </Svg>
  )
}
