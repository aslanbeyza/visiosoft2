import Button from '../../components/Button/index.ts'
import PageHero from '../../components/PageHero/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import PricingStage from './PricingStage.tsx'
import { pricingCopy } from './pricingCopy.ts'

const copy = pricingCopy.hero

/** Bölünmüş açılış: solda başlık ve eylemler, sağda site kesiti + fiyat kartı (dar ekranda metnin altında). */
export default function PricingHero() {
  const path = usePath()

  return (
    <PageHero
      variant="split"
      eyebrow={copy.eyebrow}
      title={copy.title}
      lead={copy.lead}
      mediaOrder="last"
      media={<PricingStage />}
      mediaNote={pricingCopy.diagram.note}
      actions={
        <>
          <Button to={path('quote.index')} size="lg" arrow>
            {copy.primary}
          </Button>
          <Button href={`#${pricingCopy.subNav[0].id}`} variant="secondary" size="lg">
            {copy.secondary}
          </Button>
        </>
      }
    />
  )
}
