import { useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import Reveal, { revealEase } from '../../components/Reveal/index.ts'
import TextReveal from '../../components/TextReveal/index.ts'
import { usePageVisible } from '../../hooks/usePageVisible/index.ts'
import styles from './GreetingHero.module.css'

/**
 * İletişim kahramanı: büyük selamlama cümleleri kelime kelime yükselerek sırayla değişir.
 * Başlığın altındaki ince çizgi bir sonraki selamlamaya kalan süreyi gösterir; çizgi bitince (animationend)
 * sıradaki cümleye geçilir. Döngü yalnızca görünümde ve sekme görünürken çalışır, düğmeyle duraklatılır.
 * Ekran okuyucu sabit başlığı okur; hareket azaltmada ilk selamlama sabit kalır.
 */
export type GreetingHeroProps = {
  eyebrow: string
  srTitle: string
  greetings: string[]
  lead: string
  pauseLabel: string
  playLabel: string
  actions?: ReactNode
  aside?: ReactNode
}

const WORD_STAGGER = 0.06

/** "Merhaba, sizi dinliyoruz." → ["Merhaba,", "sizi dinliyoruz."]; virgül yoksa tüm cümle ilk parçadır. */
function splitGreeting(text: string): [string, string] {
  const at = text.indexOf(', ')
  return at < 0 ? [text, ''] : [text.slice(0, at + 1), text.slice(at + 2)]
}

export default function GreetingHero({ eyebrow, srTitle, greetings, lead, pauseLabel, playLabel, actions, aside }: GreetingHeroProps) {
  const reduce = Boolean(useReducedMotion())
  const titleId = useId()
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { amount: 0.2 })
  const visible = usePageVisible()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const cycling = !reduce && greetings.length > 1
  const running = cycling && !paused && inView && visible
  const greeting = greetings[cycling ? index : 0] ?? ''
  const [head, tail] = splitGreeting(greeting)

  return (
    <section ref={ref} className={styles.hero} aria-labelledby={titleId}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <Reveal as="p" className={styles.eyebrow} y={14} amount={0.1}>
            <motion.span
              className={styles.rule}
              aria-hidden="true"
              initial={reduce ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, delay: 0.25, ease: revealEase }}
            />
            {eyebrow}
          </Reveal>

          <h1 id={titleId} className={styles.title}>
            <span className={styles.srOnly}>{`${srTitle}. ${greetings[0] ?? ''}`}</span>
            <span className={styles.visual} aria-hidden="true">
              {/* Görünmez kopyalar aynı hücrede üst üste durur; kutu en uzun selamlama kadar olur, sayfa zıplamaz.
                  Dar ekranda selam sözcüğünden sonra satır kırılır, böylece tüm selamlamalar aynı satır sayısını korur. */}
              {cycling
                ? greetings.map((text) => {
                    const [head, tail] = splitGreeting(text)
                    return (
                      <span key={`ghost-${text}`} className={styles.ghost}>
                        {head}
                        {tail ? <span className={styles.break}> </span> : null}
                        {tail}
                        <span className={styles.caret} />
                      </span>
                    )
                  })
                : null}
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={cycling ? index : 'static'}
                  className={styles.phrase}
                  exit={{ opacity: 0, y: '-0.25em' }}
                  transition={{ duration: 0.35, ease: revealEase }}
                >
                  <TextReveal as="span" mode="words" text={head} delay={0.1} stagger={WORD_STAGGER} duration={0.85} amount={0} />
                  {tail ? (
                    <>
                      <span className={styles.break}> </span>
                      <TextReveal
                        as="span"
                        mode="words"
                        text={tail}
                        delay={0.1 + head.split(' ').length * WORD_STAGGER}
                        stagger={WORD_STAGGER}
                        duration={0.85}
                        amount={0}
                      />
                    </>
                  ) : null}
                  <span className={styles.caret} />
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>

          {cycling ? (
            <div className={styles.timer} data-running={running ? 'true' : 'false'}>
              <span className={styles.track} aria-hidden="true">
                <span
                  key={index}
                  className={styles.progress}
                  onAnimationEnd={() => setIndex((current) => (current + 1) % greetings.length)}
                />
              </span>
              <button
                type="button"
                className={styles.toggle}
                onClick={() => setPaused((value) => !value)}
                aria-label={paused ? playLabel : pauseLabel}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  {paused ? <path d="M8 5.5v13l10.5-6.5L8 5.5Z" /> : <path d="M8.5 5.5v13M15.5 5.5v13" />}
                </svg>
              </button>
            </div>
          ) : null}

          <Reveal as="p" className={styles.lead} delay={0.45} y={20} amount={0.1}>
            {lead}
          </Reveal>

          {actions ? (
            <Reveal className={styles.actions} delay={0.6} y={16} amount={0.1}>
              {actions}
            </Reveal>
          ) : null}
        </div>

        {aside ? <div className={styles.aside}>{aside}</div> : null}
      </div>
    </section>
  )
}
