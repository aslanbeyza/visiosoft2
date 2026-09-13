import type { HgsStepId } from './homeHgsCopy.ts'

function Shapes({ id }: { id: HgsStepId }) {
  switch (id) {
    case 'approach':
      return (
        <>
          <path d="M4 13.5 5.7 9a2 2 0 0 1 1.9-1.3h8.8A2 2 0 0 1 18.3 9l1.7 4.5V17a1 1 0 0 1-1 1h-1.3a1 1 0 0 1-1-1v-1H7.3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z" />
          <path d="M4 13.5h16" />
          <path d="M7.5 15.3h.01M16.5 15.3h.01" strokeWidth="2.4" />
        </>
      )
    case 'read':
      return (
        <>
          <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
          <rect x="7" y="9.5" width="10" height="5" rx="1" />
        </>
      )
    case 'pay':
      return (
        <>
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <path d="M3 10h18M7 14.5h3" />
        </>
      )
    case 'gate':
      return (
        <>
          <path d="M5.5 20v-9.5" />
          <path d="M3 20h5" />
          <path d="m7 9.8 13-4.3" />
          <circle cx="5.5" cy="10.3" r="1.6" />
        </>
      )
  }
}

export default function FlowIcon({ id, className }: { id: HgsStepId; className?: string }) {
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
