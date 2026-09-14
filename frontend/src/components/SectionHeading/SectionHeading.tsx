import { motion, useReducedMotion } from 'framer-motion'
import { RevealGroup, RevealItem, revealEase } from '../Reveal/index.ts'
import TextReveal from '../TextReveal/index.ts'
import styles from './SectionHeading.module.css'

/**
 * Kullanım: `<SectionHeading id="neden-baslik" eyebrow="Neden Visiosoft" title="…" lead="…" />`
 * Kurumsal bölüm başlığı: çizgili üst etiket yükselir, başlık TextReveal ile satır satır maskeden çıkar (M2),
 * açıklama ardından belirir. `reveal="none"` başlığı yalnızca yumuşak yükselişle gösterir.
 * Hareket azaltmada her şey sabittir; başlık aynı etiket, id ve sınıfla düz metin olarak basılır.
 */
type SectionHeadingProps = {
  eyebrow?: string
  title: string
  lead?: string
  as?: 'h1' | 'h2'
  id?: string
  align?: 'start' | 'center'
  tone?: 'light' | 'dark'
  className?: string
  /** Başlık hareketi: 'lines' (varsayılan, satır maskesi) · 'none' (blok hâlinde yükselir). */
  reveal?: 'lines' | 'none'
}

export default function SectionHeading({
  eyebrow,
  title,
  lead,
  as: Heading = 'h2',
  id,
  align = 'start',
  tone = 'light',
  className = '',
  reveal = 'lines',
}: SectionHeadingProps) {
  const reduce = useReducedMotion()

  return (
    <RevealGroup className={`${styles.heading} ${className}`.trim()} stagger={0.1}>
      <div data-align={align} data-tone={tone} className={styles.inner}>
        {eyebrow ? (
          <RevealItem as="p" className={styles.eyebrow}>
            <motion.span
              className={styles.rule}
              aria-hidden="true"
              initial={reduce ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: revealEase }}
            />
            {eyebrow}
          </RevealItem>
        ) : null}
        {reveal === 'lines' ? (
          // Tetik başlığın kendisinde (kırpılmamış kök); kırpma yalnızca kelime kutularında.
          <TextReveal as={Heading} id={id} className={styles.title} text={title} delay={eyebrow ? 0.1 : 0} />
        ) : (
          <RevealItem y={32}>
            <Heading id={id} className={styles.title}>
              {title}
            </Heading>
          </RevealItem>
        )}
        {lead ? (
          <RevealItem as="p" className={styles.lead}>
            {lead}
          </RevealItem>
        ) : null}
      </div>
    </RevealGroup>
  )
}
