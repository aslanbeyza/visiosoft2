import type { PillarId } from './homeIntroCopy.ts'

const paths: Record<PillarId, string[]> = {
  stack: ['M12 3 3 7.5 12 12l9-4.5L12 3Z', 'm3 12 9 4.5 9-4.5', 'm3 16.5 9 4.5 9-4.5'],
  operation: ['M8.5 6H15a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h6.5', 'M6 8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z', 'M18 20.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z'],
  revenue: ['M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z', 'M14 3v4h4', 'm9.5 14 2 2 3.5-4'],
}

export default function PillarIcon({ id, className }: { id: PillarId; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[id].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}
