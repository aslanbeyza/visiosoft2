import Button from '../../components/Button/index.ts'
import ChipList from '../../components/ChipList/index.ts'
import Faq from '../../components/Faq/index.ts'
import { FeatureIcon } from '../../components/FeatureGrid/index.ts'
import LogoWall from '../../components/LogoWall/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import Seo from '../../components/Seo/index.ts'
import StepList from '../../components/StepList/index.ts'
import SubNav from '../../components/SubNav/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { references } from '../References/references.ts'
import AlprHero from './AlprHero.tsx'
import ContactFinale from './ContactFinale.tsx'
import ExitPreview from './ExitPreview.tsx'
import { alprCopy as copy } from './alprCopy.ts'
import styles from './AlprSections.module.css'

// Logo dosyalarının gerçek piksel ölçüleri (CLS önlemi)
const logoSizes: Record<string, [number, number]> = {
  'Crowne Plaza.png': [141, 72],
  'Metropark awm.png': [143, 145],
  'YTÜ.png': [123, 67],
  'Vema Holding.png': [137, 56],
  'byuas.png': [118, 54],
  'marmara teknokent.png': [126, 53],
}

const logos = copy.proof.logoFiles.map((file) => {
  const reference = references.find((item) => item.file === file)
  const [width, height] = logoSizes[file] ?? [160, 80]
  return {
    src: reference?.url ?? `/referanslar/logolar/${encodeURIComponent(file)}`,
    alt: reference?.name ?? file.replace(/\.[^.]+$/, ''),
    width,
    height,
  }
})

/** /plaka-tanima-cozumu — uçtan uca plaka tanıma satış sayfası. */
export default function AlprLanding() {
  const path = usePath()
  const { process, proof, demo, compliance, faq } = copy

  return (
    <>
      <Seo title={copy.metaTitle} description={copy.metaDescription} />

      <AlprHero />

      <SubNav items={copy.subNav} />

      <Section id="surec" tone="surface" spacing="lg" labelledBy="surec-baslik">
        <div className={styles.stack}>
          <div className={styles.headRow}>
            <SectionHeading id="surec-baslik" eyebrow={process.eyebrow} title={process.title} lead={process.intro} />
            <ChipList items={process.metrics} label={process.title} />
          </div>
          <StepList
            label={process.title}
            steps={process.steps.map((step, index) => ({
              title: step.title,
              description: step.description,
              icon: <FeatureIcon name={process.stepIcons[index]} />,
            }))}
          />
          <div className={styles.actions}>
            {process.steps.map((step, index) => (
              <Button
                key={step.route}
                to={path(step.route)}
                variant={index === 1 ? 'primary' : index === 0 ? 'secondary' : 'ghost'}
                arrow={index === 2}
              >
                {step.action}
              </Button>
            ))}
          </div>
        </div>
      </Section>

      <Section id="referanslar" spacing="lg" labelledBy="referanslar-baslik">
        <div className={styles.proof}>
          <SectionHeading id="referanslar-baslik" align="center" eyebrow={proof.eyebrow} title={proof.title} lead={proof.desc} />
          <LogoWall logos={logos} label={proof.title} showNames />
          <Button to={path('references')} variant="ghost" arrow className={styles.proofLink}>
            {proof.all}
          </Button>
        </div>
      </Section>

      <Section id="onizleme" tone="night" spacing="lg" labelledBy="onizleme-baslik">
        <div className={styles.demo}>
          <SectionHeading id="onizleme-baslik" tone="dark" eyebrow={demo.eyebrow} title={demo.title} lead={demo.desc} />
          <ExitPreview />
        </div>
      </Section>

      <Section id="sss" spacing="lg" labelledBy="sss-baslik">
        <div className={styles.faqLayout}>
          <div className={styles.faqAside}>
            <SectionHeading id="sss-baslik" eyebrow={faq.eyebrow} title={faq.title} />
            <div className={styles.compliance}>
              <h3 className={styles.complianceTitle}>{compliance.title}</h3>
              <ChipList items={compliance.items} label={compliance.title} />
            </div>
          </div>
          <Faq items={faq.items} label={faq.title} schema single />
        </div>
      </Section>

      <ContactFinale />
    </>
  )
}
