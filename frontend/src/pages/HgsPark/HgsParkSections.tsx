import CheckList from '../../components/CheckList/index.ts'
import FeatureGrid, { FeatureIcon } from '../../components/FeatureGrid/index.ts'
import Reveal from '../../components/Reveal/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import ConvertDiagram from './ConvertDiagram.tsx'
import { hgsParkPageCopy } from './hgsParkPageCopy.ts'
import styles from './HgsParkSections.module.css'

const { future, scope, advantages } = hgsParkPageCopy
const headingId = (id: string) => `${id}-baslik`
const pad = (value: number) => String(value).padStart(2, '0')

/** Geleceğin teknolojisi: solda başlık, sağda dönüşüm şeması; altında iki özellik kartı. */
export function HgsParkFuture() {
  return (
    <Section id={future.id} tone="surface" labelledBy={headingId(future.id)}>
      <div className={styles.split}>
        <SectionHeading id={headingId(future.id)} eyebrow={future.eyebrow} title={future.title} lead={future.lead} />
        <ConvertDiagram label={future.diagramLabel} nodes={future.diagram} />
      </div>
      <FeatureGrid
        columns={2}
        label={future.label}
        className={styles.features}
        items={future.features.map((item) => ({ ...item, icon: <FeatureIcon name={item.icon} /> }))}
      />
    </Section>
  )
}

/** Hizmet kapsamı: lacivert bant, iki onay listesi paneli (faaliyet alanları / işletme türleri). */
export function HgsParkScope() {
  const panels = [scope.activity, scope.business]

  return (
    <Section id={scope.id} tone="navy" labelledBy={headingId(scope.id)}>
      <div className={styles.headCenter}>
        <SectionHeading
          id={headingId(scope.id)}
          eyebrow={scope.eyebrow}
          title={scope.title}
          lead={scope.lead}
          align="center"
          tone="dark"
        />
      </div>
      <div className={styles.panels}>
        {panels.map((panel, index) => (
          <Reveal key={panel.title} as="article" className={styles.panel} delay={index * 0.12}>
            <header className={styles.panelHead}>
              <h3 className={styles.panelTitle}>{panel.title}</h3>
              <span className={styles.count} aria-hidden="true">
                {pad(panel.items.length)}
              </span>
            </header>
            <CheckList items={panel.items} tone="dark" />
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

/** Avantajlar: numaralı dört madde. */
export function HgsParkAdvantages() {
  return (
    <Section id={advantages.id} tone="paper" labelledBy={headingId(advantages.id)}>
      <div className={styles.headSplit}>
        <SectionHeading id={headingId(advantages.id)} eyebrow={advantages.eyebrow} title={advantages.title} />
        <p className={styles.sideLead}>{advantages.lead}</p>
      </div>
      <FeatureGrid columns={4} variant="numbered" label={advantages.label} items={advantages.items} />
    </Section>
  )
}
