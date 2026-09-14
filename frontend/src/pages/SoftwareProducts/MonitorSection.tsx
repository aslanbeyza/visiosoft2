import CheckList from '../../components/CheckList/index.ts'
import MediaFrame from '../../components/MediaFrame/index.ts'
import Picture from '../../components/Picture/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import MonitorFlow from './MonitorFlow.tsx'
import { hubImages, monitorCopy as text } from './softwareHubCopy.ts'
import styles from './MonitorSection.module.css'

/** Canlı izleme: koyu bant; başlık + kontrol listesi, izleme akışı ve gerçek panel ekran görüntüsü. */
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

      {/* Geniş panel görüntüsünde menü metinleri kenarda; parallax ölçeği onları kırpmasın diye kapalı. */}
      <MediaFrame tone="dark" caption={text.caption} parallax={0}>
        <Picture {...hubImages.panelWide} sizes="(min-width: 1280px) 80rem, 100vw" />
      </MediaFrame>
    </Section>
  )
}
