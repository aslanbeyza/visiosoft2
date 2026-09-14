import styles from './ViolationBoard.module.css'

type LegendItem = { key: string; label: string }

// Plandaki zemin işaretlerinin küçük karşılıkları (dekoratif ikon + gerçek metin).
const swatches: Record<string, string> = {
  ev: 'M9.5 2.5 4.5 10h4l-2 5.5L12 8H8z',
  disabled: 'M8.4 3.2a1.2 1.2 0 1 0 0-.1M8.4 5.6v4h3.6l1.4 3.6M7.4 7.4a3.6 3.6 0 1 0 4.1 4.4',
  rented: 'M6 9a2.6 2.6 0 1 0 0-.1M8.6 9h5.4v2.4M12 9v2',
  marked: 'M2.5 2.5h11v11h-11zM2.5 8 8 2.5M2.5 13.5l11-11M8 13.5 13.5 8',
}

export default function BoardLegend({ items }: { items: LegendItem[] }) {
  return (
    <ul className={styles.legend}>
      {items.map((item) => (
        <li key={item.key}>
          <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" data-key={item.key}>
            <path d={swatches[item.key] ?? ''} />
          </svg>
          {item.label}
        </li>
      ))}
    </ul>
  )
}
