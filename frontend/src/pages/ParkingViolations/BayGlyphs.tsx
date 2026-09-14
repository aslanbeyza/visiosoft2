// Park planı zemin işaretleri (dekoratif SVG parçaları).

type GlyphProps = { x: number; y: number; className?: string }

/** Zemin işaretleri: şarj şimşeği, engelli sembolü, kiralık anahtarı, tarama. */
export function BoltMark({ x, y, className }: GlyphProps) {
  return <path className={className} d={`M${x + 3} ${y - 11}l-8 12h7l-4 11 9-13h-7z`} />
}

export function DisabledMark({ x, y, className }: GlyphProps) {
  return (
    <g className={className} transform={`translate(${x} ${y})`}>
      <circle cx="1" cy="-12" r="2.6" data-fill="true" />
      <path d="M1-7v8h7l3 8M-1-2a7 7 0 1 0 8 9" fill="none" />
    </g>
  )
}

export function KeyMark({ x, y, className }: GlyphProps) {
  return (
    <g className={className} transform={`translate(${x} ${y})`}>
      <circle cx="-7" cy="0" r="5" fill="none" />
      <path d="M-2 0h13v5M6 0v4" fill="none" />
    </g>
  )
}
