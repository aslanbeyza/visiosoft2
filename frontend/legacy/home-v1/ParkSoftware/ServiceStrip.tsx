import { GateIcon, HubIcon, PlateIcon } from './Icons.tsx'
import { parkExtras } from './parkSoftwareCopy.ts'
import styles from './ParkSoftware.module.css'

export default function ServiceStrip() {
  const extra = parkExtras
  const items = [
    { label: extra.alpr, Icon: PlateIcon },
    { label: extra.gate, Icon: GateIcon },
    { label: extra.central, Icon: HubIcon },
  ]

  return (
    <ul className={styles.strip}>
      {items.map(({ label, Icon }) => (
        <li key={label}>
          <span className={styles.stripIcon}>
            <Icon />
          </span>
          {label}
        </li>
      ))}
    </ul>
  )
}
