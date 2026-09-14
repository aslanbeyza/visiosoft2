/**
 * Kullanım:
 *   <PageHero variant="centered" eyebrow="Teklif" title="Teklifinizi oluşturun." lead="…" actions={<Button …/>} />
 *   <PageHero variant="split" tone="night" breadcrumbs={[…]} title={['Plaka tanıma', 'saniyeler içinde']} media={<MediaFrame …/>} />
 *   <PageHero
 *     variant="product" tone="surface" eyebrow="Otopark Kiosk Sistemleri" title={copy.name} lead={copy.lead}
 *     aside={<dl>{meta.map((m) => <div key={m.label}><dt>{m.label}</dt><dd>{m.value}</dd></div>)}</dl>}
 *     media={<Picture … loading="eager" fetchPriority="high" />}
 *   />
 * Başlık TextReveal ile satır satır belirir; etiket çizgisi çizilir, açıklama/künye/eylemler sırayla yükselir.
 * `split` görseli sağa koyar (mobilde varsayılan olarak üstte, `mediaOrder="last"` ile altta);
 * `product` görseli yumuşak zeminli sahneye alır (hafif kaydırma paralaksı), `aside` içindeki çıplak <dl> künye olarak
 * biçimlenir. `centered` görsel almaz. Eski `description` özelliği `lead` ile aynıdır; `variant` verilmezse "centered".
 */
import { useId, useLayoutEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Breadcrumbs from '../Breadcrumbs/index.ts'
import type { BreadcrumbItem } from '../Breadcrumbs/index.ts'
import Reveal, { revealEase } from '../Reveal/index.ts'
import TextReveal from '../TextReveal/index.ts'
import styles from './PageHero.module.css'

export type PageHeroProps = {
  variant?: 'centered' | 'split' | 'product'
  eyebrow?: string
  /** Dizi verilirse her öğe ayrı satır olur. */
  title: string | string[]
  lead?: string
  /** Eski ad; `lead` ile aynı. */
  description?: string
  actions?: ReactNode
  breadcrumbs?: BreadcrumbItem[]
  /** split/product görsel alanı (MediaFrame, Picture, ParkingFlow…). */
  media?: ReactNode
  /** product: künye <dl>; split: açıklamanın altındaki ek içerik. */
  aside?: ReactNode
  tone?: 'paper' | 'surface' | 'night'
  className?: string
  /** Görselin dar ekrandaki sırası; split için varsayılan "first", product için "last". */
  mediaOrder?: 'first' | 'last'
  /** Görselin altındaki küçük not (ör. "temsilî görsel"). */
  mediaNote?: string
  id?: string
  /**
   * Alt boşluk: default (clamp 3–4.5rem) · compact (clamp 2.5–3.5rem; altında bitişik bir sahne/bölüm varsa) ·
   * flush (0; hero'nun zemini sonraki bölüme kesintisiz akıyorsa). Üst boşluk navbar için her zaman korunur.
   */
  spacing?: 'default' | 'compact' | 'flush'
}

export default function PageHero({
  variant = 'centered',
  eyebrow,
  title,
  lead,
  description,
  actions,
  breadcrumbs,
  media,
  aside,
  tone = 'paper',
  className = '',
  mediaOrder,
  mediaNote,
  id,
  spacing = 'default',
}: PageHeroProps) {
  const reduce = Boolean(useReducedMotion())
  const titleId = useId()
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '6%'])

  const text = lead ?? description
  const dark = tone === 'night'
  const hasMedia = variant !== 'centered' && media !== undefined && media !== null && media !== false
  const order = mediaOrder ?? (variant === 'split' ? 'first' : 'last')
  const titleProps = Array.isArray(title) ? { lines: title } : { text: title }
  const lineKey = Array.isArray(title) && title.length > 1 ? title.join('\n') : ''

  // Satır dizisi görsel olarak ayrı satırlarda kalır, ama metin (textContent) kelimeleri bitiştirmesin:
  // satır kutuları ya da <br> arasına görünmez bir boşluk düğümü eklenir (zaten boşluk varsa eklenmez).
  useLayoutEffect(() => {
    if (!lineKey) return
    const heading = document.getElementById(titleId)
    if (!heading) return
    const frags = heading.querySelector(':scope > [aria-hidden="true"]')
    const breaks = frags ? Array.from(frags.children).slice(1) : Array.from(heading.querySelectorAll(':scope > br'))
    const added: Text[] = []
    for (const element of breaks) {
      const previous = element.previousSibling
      if (previous?.nodeType === Node.TEXT_NODE && /\s$/.test(previous.textContent ?? '')) continue
      const space = document.createTextNode(' ')
      element.before(space)
      added.push(space)
    }
    return () => added.forEach((node) => node.remove())
  }, [lineKey, titleId, reduce])

  const mediaEntrance = {
    initial: reduce ? false : { opacity: 0, y: 48 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 1.1, delay: 0.25, ease: revealEase },
  }

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`${styles.hero} ${className}`.trim()}
      data-variant={variant}
      data-tone={tone}
      data-media={hasMedia}
      data-spacing={spacing === 'default' ? undefined : spacing}
      aria-labelledby={titleId}
    >
      <div className={styles.inner}>
        <div className={styles.copy}>
          {breadcrumbs && breadcrumbs.length > 0 ? (
            <Reveal className={styles.breadcrumbs} y={12} amount={0.1}>
              <Breadcrumbs items={breadcrumbs} tone={dark ? 'dark' : 'light'} />
            </Reveal>
          ) : null}

          {eyebrow ? (
            <Reveal as="p" className={styles.eyebrow} delay={0.05} y={14} amount={0.1}>
              <motion.span
                className={styles.rule}
                aria-hidden="true"
                initial={reduce ? false : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.25, ease: revealEase }}
              />
              {eyebrow}
            </Reveal>
          ) : null}

          <TextReveal as="h1" id={titleId} className={styles.title} delay={0.15} {...titleProps} />

          {text ? (
            <Reveal as="p" className={styles.lead} delay={0.45} y={20} amount={0.1}>
              {text}
            </Reveal>
          ) : null}

          {aside ? (
            <Reveal className={styles.aside} delay={0.55} y={20} amount={0.1}>
              {aside}
            </Reveal>
          ) : null}

          {actions ? (
            <Reveal className={styles.actions} delay={0.65} y={16} amount={0.1}>
              {actions}
            </Reveal>
          ) : null}
        </div>

        {hasMedia ? (
          <div className={styles.media} data-order={order}>
            {variant === 'product' ? (
              <div className={styles.stage}>
                <motion.div className={styles.stageMedia} style={reduce ? undefined : { y: parallaxY }}>
                  <motion.div className={styles.stageInner} {...mediaEntrance}>
                    {media}
                  </motion.div>
                </motion.div>
              </div>
            ) : (
              <motion.div className={styles.mediaInner} {...mediaEntrance}>
                {media}
              </motion.div>
            )}
            {mediaNote ? <p className={styles.note}>{mediaNote}</p> : null}
          </div>
        ) : null}
      </div>
    </section>
  )
}
