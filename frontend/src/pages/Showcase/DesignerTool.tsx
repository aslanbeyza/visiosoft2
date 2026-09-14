import CheckList from '../../components/CheckList/index.ts'
import Prose from '../../components/Prose/index.ts'
import Reveal from '../../components/Reveal/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import ShowcaseLayout from './ShowcaseLayout.tsx'
import SlotDraw from './SlotDraw.tsx'
import { showcaseCopy } from './showcaseCopy.ts'
import { designerStoryCopy, slotDrawCopy } from './designerCopy.ts'
import styles from './ShowcaseLayout.module.css'

/** /designer_kus_bakisi_cizim_araci — hero anı: kamera görüntüsü üzerinde slot çizimi, etiketleme ve kalibrasyon. */
export default function DesignerTool() {
  const copy = showcaseCopy['designer-tool']

  return (
    <ShowcaseLayout route="designer-tool" relatedTone="paper">
      <Section tone="night" spacing="lg" id={slotDrawCopy.id} labelledBy={slotDrawCopy.headingId}>
        <div className={styles.stack}>
          <SectionHeading
            id={slotDrawCopy.headingId}
            tone="dark"
            eyebrow={slotDrawCopy.eyebrow}
            title={slotDrawCopy.title}
            lead={slotDrawCopy.lead}
          />
          <SlotDraw />
        </div>
      </Section>

      <Section tone="surface" spacing="lg" labelledBy={designerStoryCopy.id}>
        <div className={styles.split}>
          <div className={styles.splitCopy}>
            <SectionHeading id={designerStoryCopy.id} eyebrow={designerStoryCopy.eyebrow} title={designerStoryCopy.title} />
            <Reveal delay={0.15} y={20}>
              <Prose size="lg">
                {copy.paragraphs.map((text) => (
                  <p key={text}>{text}</p>
                ))}
              </Prose>
            </Reveal>
          </div>
          <Reveal className={styles.panel} delay={0.2} y={28}>
            <CheckList items={designerStoryCopy.checks} label={designerStoryCopy.checksLabel} />
          </Reveal>
        </div>
      </Section>
    </ShowcaseLayout>
  )
}
