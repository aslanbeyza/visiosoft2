import { useId, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Button from '../../components/Button/index.ts'
import Lightbox from '../../components/Lightbox/index.ts'
import MediaFrame from '../../components/MediaFrame/index.ts'
import Picture from '../../components/Picture/index.ts'
import { RevealItem, revealEase } from '../../components/Reveal/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import { detailCopy } from './detailShared.ts'
import type { DetailDrawing as DetailDrawingData } from './detailTypes.ts'
import styles from './DetailDrawing.module.css'

type DetailDrawingProps = {
  drawing: DetailDrawingData
  name: string
}

const c = detailCopy.drawing

/** Teknik çizim: pafta kırpma açılışıyla gelir, ölçü satırları çizgiyle süpürülür, çizim tam ekran büyütülür. */
export default function DetailDrawing({ drawing, name }: DetailDrawingProps) {
  const titleId = useId()
  const reduce = Boolean(useReducedMotion())
  const [open, setOpen] = useState(false)
  const { image, dimensions } = drawing

  return (
    <Section id={c.id} tone="paper" spacing="lg" labelledBy={titleId}>
      <div className={styles.layout}>
        <div className={styles.copy}>
          <SectionHeading eyebrow={c.eyebrow} title={c.title} lead={drawing.text} id={titleId} />

          {dimensions.length > 0 ? (
            <dl className={styles.dims}>
              {dimensions.map((item, index) => (
                <motion.div
                  key={item.label}
                  className={styles.dimRow}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.6, delay: index * 0.08, ease: revealEase }}
                >
                  <motion.span
                    className={styles.sweep}
                    aria-hidden="true"
                    initial={reduce ? false : { scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.9, delay: 0.1 + index * 0.08, ease: revealEase }}
                  />
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </motion.div>
              ))}
            </dl>
          ) : null}

          <RevealItem className={styles.actions}>
            <Button type="button" variant="secondary" arrow onClick={() => setOpen(true)}>
              {c.openLabel}
            </Button>
          </RevealItem>
          {drawing.note ? <p className={styles.note}>{drawing.note}</p> : null}
        </div>

        <div className={styles.media}>
          <MediaFrame ratio={`${image.width} / ${image.height}`} fit="contain" parallax={2} className={styles.frame}>
            <Picture
              src={image.src}
              avif={image.avif}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className={styles.image}
            />
          </MediaFrame>
          {/* Fareyle çizime tıklamak da büyütür; klavye kullanıcıları görünür düğmeyi kullanır. */}
          <button type="button" className={styles.hit} tabIndex={-1} aria-hidden="true" onClick={() => setOpen(true)}>
            <span className={styles.chip}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" focusable="false">
                <circle cx="11" cy="11" r="6.5" />
                <path d="M16 16l4.5 4.5M11 8.5v5M8.5 11h5" />
              </svg>
              {c.openLabel}
            </span>
          </button>
        </div>
      </div>

      <Lightbox
        open={open}
        onClose={() => setOpen(false)}
        image={image}
        title={`${c.title}: ${name}`}
        caption={drawing.note}
        dimensions={dimensions.length > 0 ? dimensions : undefined}
        zoom={2}
        labels={{ hint: c.zoomHint, keyboardHint: c.keyboardHint, zoomIn: c.zoomIn, zoomOut: c.zoomOut }}
      />
    </Section>
  )
}
