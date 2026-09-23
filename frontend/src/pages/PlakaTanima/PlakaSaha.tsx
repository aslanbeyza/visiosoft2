import CardGrid, { LinkCard } from '../../components/CardGrid/index.ts'
import type { LinkCardImage } from '../../components/CardGrid/index.ts'
import FeatureGrid from '../../components/FeatureGrid/index.ts'
import type { FeatureItem } from '../../components/FeatureGrid/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { plakaCopy } from './plakaCopy.ts'
import styles from './PlakaSaha.module.css'

const copy = plakaCopy.saha

// Arka planı temizlenmiş ürün kartı görselleri (açık zemin için).
const productCards: { route: string; image: LinkCardImage }[] = [
  {
    route: 'hardware-products.kamera-muhafaza',
    image: {
      src: '/img/products/cards/kamera-muhafaza.webp',
      avif: '/img/products/cards/kamera-muhafaza.avif',
      width: 900,
      height: 450,
      alt: '',
      fit: 'contain',
    },
  },
  {
    route: 'hardware-products.kamera-montaj-kulesi',
    image: {
      src: '/img/products/cards/kamera-montaj-kulesi.webp',
      avif: '/img/products/cards/kamera-montaj-kulesi.avif',
      width: 675,
      height: 900,
      alt: '',
      fit: 'contain',
    },
  },
]
const guideRoutes = ['plate-recognition-system', 'alpr.landing']

/** Saha bölümü: plaka tanıma kamerasını taşıyan donanım kartları ve ilgili rehber sayfalar. */
export default function PlakaSaha() {
  const path = usePath()
  const guides: FeatureItem[] = copy.guides.map((guide, index) => ({
    title: guide.title,
    description: guide.description,
    meta: guide.eyebrow,
    to: path(guideRoutes[index]),
  }))

  return (
    <Section id="saha" tone="surface" labelledBy="saha-baslik">
      <SectionHeading eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead} id="saha-baslik" className={styles.head} />
      <CardGrid columns={2} label={copy.cardsLabel}>
        {productCards.map((card, index) => {
          const product = copy.products[index]
          return (
            <LinkCard
              key={card.route}
              to={path(card.route)}
              eyebrow={product.eyebrow}
              title={product.name}
              description={product.lead}
              image={card.image}
              index={index + 1}
              action={copy.action}
            />
          )
        })}
      </CardGrid>
      <div className={styles.guides}>
        <FeatureGrid items={guides} columns={2} variant="numbered" label={copy.guidesLabel} />
      </div>
    </Section>
  )
}
