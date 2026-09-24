import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Prose from '../../components/Prose/index.ts'
import Reveal, { revealEase } from '../../components/Reveal/index.ts'
import Section from '../../components/Section/index.ts'
import { fieldManualCopy as copy } from './fieldManualCopy.ts'
import { OVERVIEW_ID, chapterId } from './manualChapters.ts'
import type { ManualData, ManualSectionData } from './useFieldManual.ts'
import styles from './ManualBody.module.css'

type ChunkProps = { children: ReactNode; isStatic: boolean; divider: boolean }

function Chunk({ children, isStatic, divider }: ChunkProps) {
  const reduce = Boolean(useReducedMotion()) || isStatic
  const line = divider ? (
    <motion.span
      className={styles.hairline}
      aria-hidden="true"
      initial={reduce ? false : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 1 }}
      transition={{ duration: 1.1, ease: revealEase }}
    />
  ) : null

  if (reduce) {
    return (
      <div className={styles.chunk}>
        {line}
        {children}
      </div>
    )
  }
  return (
    <Reveal className={styles.chunk} y={20} amount={0.05}>
      {line}
      {children}
    </Reveal>
  )
}

function SectionContent({ section, manual }: { section: ManualSectionData; manual: ManualData }) {
  const paragraphs = (section.paragraphs ?? []).filter(Boolean)
  const items = (section.items ?? []).filter(Boolean)
  const specs = (section.specs ?? []).filter((spec) => spec.label && spec.value)
  const empty = !section.summary && !section.body && paragraphs.length === 0 && items.length === 0 && specs.length === 0

  return (
    <>
      {section.summary ? <p className={styles.summary}>{section.summary}</p> : null}
      {section.body ? <p>{section.body}</p> : null}
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      {items.length > 0 ? (
        <ul>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      {specs.length > 0 ? (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">{manual.specs_key_label || copy.specsKey}</th>
                <th scope="col">{manual.specs_value_label || copy.specsValue}</th>
              </tr>
            </thead>
            <tbody>
              {specs.map((spec) => (
                <tr key={spec.label}>
                  <th scope="row">{spec.label}</th>
                  <td>{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {empty ? <p className={styles.empty}>{manual.empty_section_message || copy.emptySection}</p> : null}
    </>
  )
}

export default function ManualBody({ manual, isStatic }: { manual: ManualData; isStatic: boolean }) {
  const sections = manual.sections ?? []

  return (
    <Section tone="paper" spacing="lg" width="content">
      <div className={styles.body}>
        {manual.title || manual.document_type ? (
          <div className={styles.docHead}>
            {manual.document_type ? <p className={styles.docType}>{manual.document_type}</p> : null}
            {manual.title ? <p className={styles.docTitle}>{manual.title}</p> : null}
          </div>
        ) : null}

        <Prose toc={!isStatic} tocLabel={manual.toc_title || copy.chaptersTitle}>
          {manual.overview ? (
            <Chunk isStatic={isStatic} divider={false}>
              <h2 id={OVERVIEW_ID}>{manual.overview_title || copy.overviewTitle}</h2>
              <p>{manual.overview}</p>
            </Chunk>
          ) : null}
          {sections.map((section, index) => (
            <Chunk key={chapterId(index)} isStatic={isStatic} divider={index > 0 || Boolean(manual.overview)}>
              <h2 id={chapterId(index)} className={styles.chapterTitle}>
                {section.title?.trim() || `Bölüm ${index + 1}`}
              </h2>
              <SectionContent section={section} manual={manual} />
            </Chunk>
          ))}
        </Prose>

        {manual.footer_note ? <p className={styles.footerNote}>{manual.footer_note}</p> : null}
      </div>
    </Section>
  )
}
