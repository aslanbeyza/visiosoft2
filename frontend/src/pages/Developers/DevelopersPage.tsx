import Button from '../../components/Button/index.ts'
import CheckList from '../../components/CheckList/index.ts'
import CtaBand from '../../components/CtaBand/index.ts'
import FeatureGrid from '../../components/FeatureGrid/index.ts'
import PageHero from '../../components/PageHero/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import Seo from '../../components/Seo/index.ts'
import SubNav from '../../components/SubNav/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { developersCopy as copy } from './developersCopy.ts'
import HeroTerminal from './HeroTerminal.tsx'
import LayerFlow from './LayerFlow.tsx'
import styles from './DevelopersPage.module.css'

// Sayfa beyaz / yüzey ağırlıklı; lacivert yalnızca CTA bandında vurgu olarak kalır.
const layers = [
  { id: 'gate-sdk', tone: 'paper', data: copy.gate },
  { id: 'zone-api', tone: 'surface', data: copy.zone },
] as const

export default function DevelopersPage() {
  const path = usePath()

  return (
    <div className={styles.page}>
      <Seo title={copy.seo.title} description={copy.seo.description} />

      <PageHero
        variant="split"
        eyebrow={copy.hero.eyebrow}
        title={copy.hero.title}
        lead={copy.hero.lead}
        mediaOrder="last"
        actions={
          <>
            <Button to={path('contact')} size="lg" arrow>
              {copy.hero.primary}
            </Button>
            <Button to={path('software-products')} variant="secondary" size="lg">
              {copy.hero.secondary}
            </Button>
          </>
        }
        media={
          <HeroTerminal
            label={copy.hero.terminalLabel}
            flow={copy.code.flow}
            socket={copy.code.socket}
            webhook={copy.code.webhook}
          />
        }
      />

      <SubNav items={copy.subNav} />

      {layers.map((layer, index) => (
        <Section key={layer.id} id={layer.id} tone={layer.tone} labelledBy={`${layer.id}-title`}>
          <div className={styles.layer} data-flip={index % 2 === 1}>
            <div className={styles.layerCopy}>
              <SectionHeading
                id={`${layer.id}-title`}
                eyebrow={layer.data.eyebrow}
                title={layer.data.title}
                lead={layer.data.lead}
              />
              <CheckList items={layer.data.points} label={layer.data.eyebrow} />
            </div>
            <div className={styles.layerFlow}>
              <LayerFlow label={copy.flowLabel(layer.data.flow.hub)} tone="light" {...layer.data.flow} />
            </div>
          </div>
        </Section>
      ))}

      <Section id="kullanim" tone="surface" labelledBy="kullanim-title">
        <SectionHeading
          id="kullanim-title"
          eyebrow={copy.useCases.eyebrow}
          title={copy.useCases.title}
          lead={copy.useCases.lead}
          className={styles.heading}
        />
        <FeatureGrid items={copy.useCases.items} columns={4} variant="numbered" label={copy.useCases.eyebrow} />
      </Section>

      <CtaBand
        eyebrow={copy.cta.eyebrow}
        title={copy.cta.title}
        description={copy.cta.description}
        primary={{ label: copy.cta.primary, to: path('contact') }}
        secondary={{ label: copy.cta.secondary, to: path('software-products') }}
      />
    </div>
  )
}
