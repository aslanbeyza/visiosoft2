import { useCallback, useId, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import Button from '../../components/Button/index.ts'
import Picture from '../../components/Picture/index.ts'
import Reveal, { RevealGroup, RevealItem, revealEase } from '../../components/Reveal/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import DrawingDialog from './DrawingDialog.tsx'
import type { ProductDetailData } from './productDetailCopy.ts'
import styles from './TechnicalDrawing.module.css'

type TechnicalDrawingProps = {
  drawing: NonNullable<ProductDetailData['drawing']>
}

/** Teknik çizim önizlemesi; tıklanınca yakınlaştırılabilir erişilebilir pencerede açılır. */
export default function TechnicalDrawing({ drawing }: TechnicalDrawingProps) {
  const reduce = Boolean(useReducedMotion())
  const titleId = useId()
  const describeId = useId()
  const figureRef = useRef<HTMLElement>(null)
  // Kırpılmış çerçeve kendi görünürlüğünü algılayamaz; açılış kırpılmamış figure'dan tetiklenir.
  const figureInView = useInView(figureRef, { once: true, amount: 0.3 })
  const [open, setOpen] = useState(false)
  const openDialog = useCallback(() => setOpen(true), [])
  const closeDialog = useCallback(() => setOpen(false), [])

  return (
    <Section id={drawing.id} tone="surface" spacing="lg" labelledBy={titleId}>
      <div className={styles.layout}>
        <div className={styles.copy}>
          <SectionHeading eyebrow={drawing.eyebrow} title={drawing.title} lead={drawing.text} id={titleId} />

          <RevealGroup className={styles.dimsWrap} stagger={0.08} delay={0.15}>
            <dl className={styles.dims}>
              {drawing.dimensions.map((item) => (
                <RevealItem key={item.label} className={styles.dim}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </RevealItem>
              ))}
            </dl>
          </RevealGroup>

          <Reveal delay={0.25} className={styles.action}>
            <Button variant="secondary" onClick={openDialog}>
              <ZoomIcon className={styles.buttonIcon} />
              {drawing.openLabel}
            </Button>
          </Reveal>
        </div>

        <figure ref={figureRef} className={styles.figure}>
          <motion.div
            className={styles.frame}
            initial={reduce ? false : { clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={figureInView ? { clipPath: 'inset(0% 0% 0% 0%)' } : undefined}
            transition={{ duration: 1.1, ease: revealEase }}
          >
            <button
              type="button"
              className={styles.trigger}
              onClick={openDialog}
              aria-haspopup="dialog"
              aria-label={drawing.openLabel}
              aria-describedby={describeId}
            >
              <motion.span
                className={styles.imageWrap}
                initial={reduce ? false : { scale: 1.08 }}
                animate={figureInView ? { scale: 1 } : undefined}
                transition={{ duration: 1.2, ease: revealEase }}
              >
                <Picture
                  src={drawing.image.src}
                  alt=""
                  width={drawing.image.width}
                  height={drawing.image.height}
                  className={styles.image}
                  pictureClassName={styles.picture}
                />
              </motion.span>
              <span className={styles.chip} aria-hidden="true">
                <ZoomIcon className={styles.chipIcon} />
                {drawing.openLabel}
              </span>
              <span id={describeId} className={styles.srOnly}>
                {drawing.image.alt}
              </span>
            </button>
          </motion.div>
          <figcaption className={styles.note}>{drawing.note}</figcaption>
        </figure>
      </div>

      <AnimatePresence>
        {open ? (
          <DrawingDialog
            key="drawing-dialog"
            image={drawing.image}
            title={drawing.dialogTitle}
            hint={drawing.zoomHint}
            keyboardHint={drawing.keyboardHint}
            zoomInLabel={drawing.zoomInLabel}
            zoomOutLabel={drawing.zoomOutLabel}
            closeLabel={drawing.closeLabel}
            dimensions={drawing.dimensions}
            onClose={closeDialog}
          />
        ) : null}
      </AnimatePresence>
    </Section>
  )
}

function ZoomIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.4-4.4M11 8.5v5M8.5 11h5" />
    </svg>
  )
}
