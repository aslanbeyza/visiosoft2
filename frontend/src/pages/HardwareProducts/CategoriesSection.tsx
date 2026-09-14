import { motion, useReducedMotion } from 'framer-motion'
import Picture from '../../components/Picture/index.ts'
import { revealEase } from '../../components/Reveal/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import StatRow from '../../components/StatRow/index.ts'
import { company } from '../../data/company.ts'
import type { CategoryKey } from './data.ts'
import { categories, hardwareItems } from './data.ts'
import { lineupItems } from './lineup.ts'
import { categoriesCopy } from './listingCopy.ts'
import styles from './CategoriesSection.module.css'

type CategoriesSectionProps = {
  onSelect: (key: CategoryKey) => void
}

const HEADING_ID = 'kategoriler-baslik'
const pad = (value: number) => String(value).padStart(2, '0')

const stats = [
  { value: hardwareItems.length, label: categoriesCopy.stats.products },
  { value: categories.length, label: categoriesCopy.stats.categories },
  { value: company.locations.length, label: categoriesCopy.stats.locations, note: categoriesCopy.stats.locationsNote },
  { value: company.foundedYear, from: 2000, label: categoriesCopy.stats.founded },
]

/** Kategori satırları (M12 süpürme çizgisi) ürün filtresini ayarlar; altında gerçek sayılar. */
export default function CategoriesSection({ onSelect }: CategoriesSectionProps) {
  const reduce = useReducedMotion()

  return (
    <Section id="kategoriler" tone="paper" labelledBy={HEADING_ID}>
      <div className={styles.layout}>
        <SectionHeading id={HEADING_ID} eyebrow={categoriesCopy.eyebrow} title={categoriesCopy.title} lead={categoriesCopy.description} className={styles.heading} />

        <ol className={styles.list}>
          {categories.map((category, index) => {
            const members = hardwareItems.filter((item) => item.category === category.key)
            return (
              <motion.li
                key={category.key}
                className={styles.row}
                initial={reduce ? false : 'hidden'}
                whileInView="show"
                viewport={{ once: true, amount: 0.6 }}
                variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.7, ease: revealEase, delay: index * 0.08 }}
              >
                <motion.span
                  className={styles.sweep}
                  aria-hidden="true"
                  variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1 } }}
                  transition={{ duration: 1.1, ease: revealEase, delay: index * 0.08 + 0.1 }}
                />
                <button type="button" className={styles.button} onClick={() => onSelect(category.key)}>
                  <span className={styles.index} aria-hidden="true">
                    {pad(index + 1)}
                  </span>
                  <span className={styles.text}>
                    <span className={styles.label}>{category.label}</span>
                    <span className={styles.description}>{category.description}</span>
                  </span>
                  <span className={styles.thumbs} aria-hidden="true">
                    {members.map((item) => {
                      // Kenar boşluğu kırpılmış kesimler küçük boyda daha okunaklıdır; yoksa kart görseli.
                      const thumb = lineupItems.find((entry) => entry.slug === item.slug) ?? item.image
                      return (
                        <Picture
                          key={item.slug}
                          src={thumb.src}
                          avif={thumb.avif}
                          width={thumb.width}
                          height={thumb.height}
                          alt=""
                          className={styles.thumb}
                          pictureClassName={styles.thumbPicture}
                        />
                      )
                    })}
                  </span>
                  <span className={styles.count}>
                    {members.length} {categoriesCopy.productUnit}
                    <span className={styles.srOnly}> — {categoriesCopy.showProducts}</span>
                  </span>
                  <svg className={styles.arrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <path d="M12 5v14M6 13l6 6 6-6" />
                  </svg>
                </button>
              </motion.li>
            )
          })}
        </ol>
      </div>

      <StatRow items={stats} columns={4} label={categoriesCopy.statsLabel} className={styles.stats} />
    </Section>
  )
}
