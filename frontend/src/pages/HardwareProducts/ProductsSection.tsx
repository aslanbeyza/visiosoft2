import CardGrid, { LinkCard } from '../../components/CardGrid/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import CategoryFilter from './CategoryFilter.tsx'
import type { FilterKey } from './CategoryFilter.tsx'
import { categories, categoryLabel, formatDimensions, hardwareItems } from './data.ts'
import { productsCopy } from './listingCopy.ts'
import SystemTile from './SystemTile.tsx'
import styles from './ProductsSection.module.css'

type ProductsSectionProps = {
  active: FilterKey
  onChange: (key: FilterKey) => void
}

const HEADING_ID = 'urunler-baslik'

const counts = Object.fromEntries([
  ['all', hardwareItems.length],
  ...categories.map((category) => [category.key, hardwareItems.filter((item) => item.category === category.key).length]),
]) as Record<FilterKey, number>

/** Ürün kartları + kategori filtresi; filtre değişiminde kartlar layout animasyonuyla yer değiştirir. */
export default function ProductsSection({ active, onChange }: ProductsSectionProps) {
  const path = usePath()
  const visible = active === 'all' ? hardwareItems : hardwareItems.filter((item) => item.category === active)
  // Kutucuk son satırı tamamlar: 3 ve 2 sütunlu ızgarada boş kalan hücre sayısı kadar genişler.
  const rest3 = visible.length % 3
  const span3 = (rest3 === 0 ? 3 : 3 - rest3) as 1 | 2 | 3
  const span2 = (visible.length % 2 === 0 ? 2 : 1) as 1 | 2

  return (
    <Section id="urunler" tone="surface" labelledBy={HEADING_ID}>
      <div className={styles.head}>
        <SectionHeading id={HEADING_ID} eyebrow={productsCopy.eyebrow} title={productsCopy.title} lead={productsCopy.description} />
        <CategoryFilter active={active} onChange={onChange} counts={counts} visibleCount={visible.length} />
      </div>

      <CardGrid columns={3} label={productsCopy.title} animateLayout className={styles.grid}>
        {visible.map((item) => (
          <LinkCard
            key={item.slug}
            to={path(item.route)}
            eyebrow={categoryLabel(item.category)}
            title={item.name}
            description={item.lead}
            image={{ ...item.image, alt: '' }}
            index={hardwareItems.indexOf(item) + 1}
            meta={formatDimensions(item.dimensions)}
            action={productsCopy.action}
          />
        ))}
        <SystemTile key="system-tile" span3={span3} span2={span2} />
      </CardGrid>
    </Section>
  )
}
