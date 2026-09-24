import ChipList from '../../components/ChipList/index.ts'
import MediaFrame from '../../components/MediaFrame/index.ts'
import Picture from '../../components/Picture/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import Reveal from '../../components/Reveal/index.ts'
import { aboutPageCopy } from './aboutPageCopy.ts'
import styles from './AboutTeam.module.css'

const copy = aboutPageCopy.team

export default function AboutTeam({ id }: { id: string }) {
  const headingId = `${id}-baslik`

  return (
    <Section id={id} tone="paper" spacing="lg" labelledBy={headingId}>
      <div className={styles.grid}>
        <div className={styles.copy}>
          <SectionHeading id={headingId} eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead} />
          <Reveal className={styles.chips} delay={0.2} y={16}>
            <ChipList items={copy.disciplines} label={copy.disciplinesLabel} />
          </Reveal>
        </div>
        <MediaFrame className={styles.media} ratio="1617 / 828" parallax={4} caption={copy.caption}>
          <Picture
            src="/img/pages/visiosoft_visio_takimimiz.webp"
            alt={copy.alt}
            width={1617}
            height={828}
            sizes="(min-width: 1024px) 56vw, 100vw"
          />
        </MediaFrame>
      </div>
    </Section>
  )
}
