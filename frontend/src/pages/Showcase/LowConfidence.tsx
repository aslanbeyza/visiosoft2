import FeatureGrid, { ClockIcon, SettingsIcon, ShieldIcon } from '../../components/FeatureGrid/index.ts'
import MediaFrame from '../../components/MediaFrame/index.ts'
import Picture from '../../components/Picture/index.ts'
import Prose from '../../components/Prose/index.ts'
import Reveal from '../../components/Reveal/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import ConfidenceFork from './ConfidenceFork.tsx'
import ShowcaseLayout from './ShowcaseLayout.tsx'
import { showcaseCopy } from './showcaseCopy.ts'
import { approvalCopy, forkCopy, lowFeaturesCopy } from './lowConfidenceCopy.ts'
import styles from './ShowcaseLayout.module.css'

const icons = { merkez: <SettingsIcon />, hiz: <ClockIcon />, dogruluk: <ShieldIcon /> }

export default function LowConfidence() {
  const copy = showcaseCopy['low-confidence']

  return (
    <ShowcaseLayout route="low-confidence" relatedTone="paper">
      <Section tone="surface" spacing="lg" id={forkCopy.id} labelledBy={forkCopy.headingId}>
        <div className={styles.stack}>
          <SectionHeading id={forkCopy.headingId} eyebrow={forkCopy.eyebrow} title={forkCopy.title} lead={forkCopy.lead} />
          <ConfidenceFork />
        </div>
      </Section>

      <Section tone="paper" spacing="lg" labelledBy={approvalCopy.id}>
        <div className={styles.split}>
          <div className={styles.splitCopy}>
            <SectionHeading id={approvalCopy.id} eyebrow={approvalCopy.eyebrow} title={approvalCopy.title} />
            <Reveal delay={0.15} y={20}>
              <Prose size="lg">
                {copy.paragraphs.map((text) => (
                  <p key={text}>{text}</p>
                ))}
              </Prose>
            </Reveal>
          </div>
          {}
          <MediaFrame className={styles.splitMedia} ratio="1010 / 448" mode="screenshot" caption={approvalCopy.caption}>
            <Picture {...approvalCopy.image} sizes="(min-width: 1024px) 50vw, 100vw" />
          </MediaFrame>
        </div>
      </Section>

      <Section tone="surface" labelledBy={lowFeaturesCopy.id}>
        <div className={styles.stack}>
          <SectionHeading id={lowFeaturesCopy.id} eyebrow={lowFeaturesCopy.eyebrow} title={lowFeaturesCopy.title} />
          <FeatureGrid
            columns={3}
            label={lowFeaturesCopy.title}
            items={lowFeaturesCopy.items.map((item) => ({
              icon: icons[item.key as keyof typeof icons],
              title: item.title,
              description: item.description,
            }))}
          />
        </div>
      </Section>
    </ShowcaseLayout>
  )
}
