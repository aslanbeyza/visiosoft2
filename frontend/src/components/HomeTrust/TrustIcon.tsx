import type { PillarIcon } from './homeTrustCopy.ts'

const paths: Record<PillarIcon, string[]> = {

  system: ['M12 3 3 7.5l9 4.5 9-4.5L12 3Z', 'm3 12 9 4.5 9-4.5', 'm3 16.5 9 4.5 9-4.5'],

  support: [
    'M4 14v-2a8 8 0 0 1 16 0v2',
    'M4 14a2 2 0 0 1 2-2h1v6H6a2 2 0 0 1-2-2v-2Z',
    'M20 14a2 2 0 0 0-2-2h-1v6h1a2 2 0 0 0 2-2v-2Z',
    'M18 18c0 1.7-1.8 3-4 3h-2',
  ],

  records: ['M8 6h12', 'M8 12h12', 'M8 18h6', 'M4 6h.01', 'M4 12h.01', 'm16 18 1.6 1.6L21 16'],
}

export default function TrustIcon({ name, className }: { name: PillarIcon; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}
