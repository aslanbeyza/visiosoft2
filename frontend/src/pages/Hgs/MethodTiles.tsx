import { useId } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { RevealGroup, RevealItem } from '../../components/Reveal/index.ts'
import HgsIcon from './hgsIcons.tsx'
import type { MethodIconName, MethodKey, PaymentMethod } from './hgsPageCopy.ts'
import styles from './MethodTiles.module.css'

type MethodTilesProps = {
  methods: PaymentMethod[]
  selected: MethodKey
  onSelect: (key: MethodKey) => void
  label: string
}

const icons: Record<MethodKey, MethodIconName> = { hgs: 'hgs', pos: 'card', qr: 'qr' }
const pad = (value: number) => String(value).padStart(2, '0')

/** Yöntem kutucukları (aria-pressed düğmeler). ≥1024px'te sütun, yanındaki sahne + rota sütununun yüksekliğine uzar. */
export default function MethodTiles({ methods, selected, onSelect, label }: MethodTilesProps) {
  const baseId = useId()

  // Fareyle üzerine gelmek seçer; dokunmatikte seçim dokunarak yapılır.
  const hover = (key: MethodKey) => (event: ReactPointerEvent) => {
    if (event.pointerType === 'mouse' && key !== selected) onSelect(key)
  }

  return (
    <div className={styles.root} role="group" aria-label={label}>
      <RevealGroup as="ul" className={styles.tiles} stagger={0.09} amount={0.25}>
        {methods.map((method, index) => {
          const on = method.key === selected
          const descId = `${baseId}-${method.key}`
          return (
            <RevealItem as="li" key={method.key} y={18}>
              <div className={styles.tile} data-on={on} onPointerEnter={hover(method.key)}>
                <span className={styles.bar} aria-hidden="true" />
                <button
                  type="button"
                  className={styles.button}
                  aria-pressed={on}
                  aria-describedby={descId}
                  onClick={() => onSelect(method.key)}
                  onFocus={() => onSelect(method.key)}
                >
                  <span className={styles.icon} aria-hidden="true">
                    <HgsIcon name={icons[method.key]} />
                  </span>
                  <span className={styles.text}>
                    <span className={styles.label}>{method.label}</span>
                    <span className={styles.title}>{method.title}</span>
                  </span>
                  <span className={styles.index} aria-hidden="true">
                    {pad(index + 1)}
                  </span>
                </button>
                <p id={descId} className={styles.desc}>
                  {method.description}
                </p>
              </div>
            </RevealItem>
          )
        })}
      </RevealGroup>
    </div>
  )
}
