import CtaBand from '../../components/CtaBand/index.ts'
import PageHero from '../../components/PageHero/index.ts'
import Section from '../../components/Section/index.ts'
import Seo from '../../components/Seo/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import GlossaryDirectory from './GlossaryDirectory.tsx'
import { glossaryCopy as copy } from './glossaryCopy.ts'
import { glossaryTerms } from './terms.ts'
import styles from './GlossaryPage.module.css'

/**
 * /otopark-terimleri — saha ve otopark dilinin kısa sözlüğü.
 * Destek ailesinde durur (kılavuz, blog); ana menüye girmez.
 */
export default function GlossaryPage() {
  const path = usePath()

  return (
    <>
      <Seo title={copy.seoTitle} description={copy.seoDescription} />
      <PageHero
        variant="centered"
        eyebrow={copy.eyebrow}
        title={copy.title}
        lead={copy.lead}
        aside={<p className={styles.count}>{copy.count(glossaryTerms.length)}</p>}
      />
      <Section tone="surface" spacing="lg" width="wide" label={copy.title}>
        <GlossaryDirectory />
      </Section>
      <CtaBand
        eyebrow={copy.cta.eyebrow}
        title={copy.cta.title}
        description={copy.cta.description}
        primary={{ label: copy.cta.primary, to: path('contact') }}
        secondary={{ label: copy.cta.secondary, to: path('field-manual') }}
      />
    </>
  )
}
