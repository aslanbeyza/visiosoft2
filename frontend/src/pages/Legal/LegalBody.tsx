import { Fragment } from 'react'
import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Button from '../../components/Button/index.ts'
import Prose from '../../components/Prose/index.ts'
import Reveal, { revealEase } from '../../components/Reveal/index.ts'
import Section from '../../components/Section/index.ts'
import { company } from '../../data/company.ts'
import type { LegalPage } from './legalCopy.ts'
import { legalPageCopy as copy } from './legalPageCopy.ts'
import styles from './LegalBody.module.css'

type LegalBlock = LegalPage['blocks'][number]

/** Metindeki e-posta adreslerini mailto bağlantısına çevirir. */
function withLinks(text: string): ReactNode {
  const parts = text.split(/([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/)
  if (parts.length === 1) return text
  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <a key={`${index}-${part}`} href={`mailto:${part}`}>
        {part}
      </a>
    ) : (
      <Fragment key={`${index}-${part}`}>{part}</Fragment>
    ),
  )
}

/** Blokları h2 başlıklarından bölümlere ayırır; her bölüm ayrı belirir. */
function toChunks(blocks: LegalBlock[]) {
  const chunks: LegalBlock[][] = []
  for (const block of blocks) {
    if (block.type === 'h2' || chunks.length === 0) chunks.push([block])
    else chunks[chunks.length - 1].push(block)
  }
  return chunks
}

function renderBlock(block: LegalBlock, key: string) {
  switch (block.type) {
    case 'h2':
      return <h2 key={key}>{block.text}</h2>
    case 'ul':
      return (
        <ul key={key}>
          {block.items.map((item) => (
            <li key={item}>{withLinks(item)}</li>
          ))}
        </ul>
      )
    case 'facts':
      return (
        <dl key={key} className={styles.facts}>
          {block.items.map((item) => (
            <div key={item.label} className={styles.fact}>
              <dt>{item.label}</dt>
              <dd>{withLinks(item.value)}</dd>
            </div>
          ))}
        </dl>
      )
    default:
      return <p key={key}>{withLinks(block.text)}</p>
  }
}

export default function LegalBody({ page }: { page: LegalPage }) {
  const reduce = Boolean(useReducedMotion())
  const chunks = toChunks(page.blocks)

  return (
    <Section tone="paper" spacing="lg" width="content">
      <div className={styles.body}>
        <Prose toc>
          {chunks.map((chunk, index) => {
            const key = chunk[0].type === 'h2' ? chunk[0].text : `giris-${index}`
            return (
              <Reveal key={key} className={styles.chunk} y={20} amount={0.05}>
                {index > 0 ? (
                  <motion.span
                    className={styles.hairline}
                    aria-hidden="true"
                    initial={reduce ? false : { scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, amount: 1 }}
                    transition={{ duration: 1.1, ease: revealEase }}
                  />
                ) : null}
                {chunk.map((block, blockIndex) => renderBlock(block, `${key}-${blockIndex}`))}
              </Reveal>
            )
          })}
        </Prose>

        <Reveal className={styles.contact} y={16} amount={0.4}>
          <div className={styles.contactCopy}>
            <p className={styles.contactTitle}>{copy.contactTitle}</p>
            <p className={styles.contactBody}>{copy.contactBody}</p>
          </div>
          <Button href={`mailto:${company.email}`} variant="secondary" arrow>
            {copy.contactAction}
          </Button>
        </Reveal>
      </div>
    </Section>
  )
}
