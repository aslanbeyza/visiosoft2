import CheckList from '../../components/CheckList/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import MonitorFlow from './MonitorFlow.tsx'
import { monitorCopy as text } from './softwareHubCopy.ts'
import styles from './MonitorSection.module.css'

export default function MonitorSection() {
  return (
    <Section id="canli-izleme" tone="night" spacing="lg" labelledBy="hub-monitor-title">
      <div className={styles.top}>
        <SectionHeading eyebrow={text.eyebrow} title={text.title} lead={text.lead} tone="dark" id="hub-monitor-title" />
        <CheckList items={text.checks} tone="dark" label={text.checksLabel} className={styles.checks} />
      </div>

      <div className={styles.flow} role="group" aria-label={text.flowLabel}>
        <MonitorFlow />
      </div>
    </Section>
  )
}
