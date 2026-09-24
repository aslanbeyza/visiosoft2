import FeatureGrid, { FeatureIcon } from '../../components/FeatureGrid/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import StepList from '../../components/StepList/index.ts'
import HgsFallbackStory from './HgsFallbackStory.tsx'
import HgsIcon from './hgsIcons.tsx'
import { hgsPageCopy } from './hgsPageCopy.ts'
import styles from './HgsSections.module.css'

const { methods, advantages, flow, sectors } = hgsPageCopy
const headingId = (id: string) => `${id}-baslik`

export function HgsMethods() {
  return (
    <Section id={methods.id} tone="paper" labelledBy={headingId(methods.id)}>
      <div className={styles.headSplit}>
        <SectionHeading id={headingId(methods.id)} eyebrow={methods.eyebrow} title={methods.title} />
        <p className={styles.sideLead}>{methods.lead}</p>
      </div>
      <FeatureGrid
        columns={4}
        label={methods.label}
        items={methods.items.map((item) => ({ ...item, icon: <HgsIcon name={item.icon} /> }))}
      />
    </Section>
  )
}

export function HgsAdvantages() {
  const { fallbackStory } = advantages

  return (
    <Section id={advantages.id} tone="surface" labelledBy={headingId(advantages.id)}>
      <div className={styles.split}>
        <div className={styles.splitMedia}>
          <SectionHeading
            id={headingId(advantages.id)}
            eyebrow={advantages.eyebrow}
            title={advantages.title}
            lead={advantages.lead}
          />
          <HgsFallbackStory
            className={styles.frame}
            kicker={fallbackStory.kicker}
            caption={fallbackStory.caption}
            ariaLabel={fallbackStory.ariaLabel}
            metrics={fallbackStory.metrics}
            session={fallbackStory.session}
            steps={fallbackStory.steps}
          />
        </div>
        <FeatureGrid
          columns={2}
          variant="plain"
          label={advantages.label}
          className={styles.splitGrid}
          items={advantages.items.map((item) => ({ ...item, icon: <HgsIcon name={item.icon} /> }))}
        />
      </div>
    </Section>
  )
}

export function HgsFlow() {
  return (
    <Section id={flow.id} tone="navy" labelledBy={headingId(flow.id)}>
      <div className={styles.headSplit}>
        <SectionHeading id={headingId(flow.id)} eyebrow={flow.eyebrow} title={flow.title} tone="dark" />
        <p className={styles.sideLead} data-tone="dark">
          {flow.lead}
        </p>
      </div>
      <StepList
        direction="horizontal"
        progress="scroll"
        tone="dark"
        label={flow.label}
        steps={flow.steps.map((step) => ({ ...step, icon: <FeatureIcon name={step.icon} /> }))}
      />
    </Section>
  )
}

export function HgsSectors() {
  return (
    <Section id={sectors.id} tone="paper" labelledBy={headingId(sectors.id)}>
      <div className={styles.headCenter}>
        <SectionHeading id={headingId(sectors.id)} eyebrow={sectors.eyebrow} title={sectors.title} align="center" />
      </div>
      <FeatureGrid
        columns={3}
        variant="plain"
        label={sectors.label}
        items={sectors.items.map((item) => ({ ...item, icon: <HgsIcon name={item.icon} /> }))}
      />
    </Section>
  )
}
