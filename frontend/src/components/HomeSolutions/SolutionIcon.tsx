import type { SolutionIconId } from './homeSolutionsCopy.ts'

function Shapes({ id }: { id: SolutionIconId }) {
  switch (id) {
    case 'parking':
      return (
        <>
          <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
          <path d="M10 16.5v-9h3a2.75 2.75 0 0 1 0 5.5h-3" />
        </>
      )
    case 'residence':
      return (
        <>
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5.5 8.9V20h13V8.9" />
          <path d="M10 20v-5.5h4V20" />
        </>
      )
    case 'street':
      return (
        <>
          <path d="M8.5 3 5 21" />
          <path d="M15.5 3 19 21" />
          <path d="M12 4.5v2.5M12 10.5v3M12 17v3" />
        </>
      )
    case 'truck':
      return (
        <>
          <path d="M2.5 6.5h10.5v9H2.5z" />
          <path d="M13 9.5h4.2l3.3 3.3v2.7H13" />
          <circle cx="6.5" cy="17.5" r="1.7" />
          <circle cx="17" cy="17.5" r="1.7" />
        </>
      )
  }
}

export default function SolutionIcon({ id, className }: { id: SolutionIconId; className?: string }) {
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
      <Shapes id={id} />
    </svg>
  )
}
