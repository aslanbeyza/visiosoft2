import { useId, useRef } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Button from '../../components/Button/index.ts'
import Picture from '../../components/Picture/index.ts'
import Reveal, { revealEase } from '../../components/Reveal/index.ts'
import TextReveal from '../../components/TextReveal/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { hgsParkPageCopy } from './hgsParkPageCopy.ts'
import styles from './HgsParkHero.module.css'

const { hero, future } = hgsParkPageCopy

/* Kadran geometrisi (viewBox 400): 60 çentik, her beşincisi uzun; halka tepeden saat yönünde çizilir. */
const C = 200
const point = (i: number, r: number) => {
  const a = (i / 60) * Math.PI * 2 - Math.PI / 2
  return `${(C + r * Math.cos(a)).toFixed(2)} ${(C + r * Math.sin(a)).toFixed(2)}`
}
const ticks = (major: boolean) =>
  Array.from({ length: 60 }, (_, i) => i)
    .filter((i) => (i % 5 === 0) === major)
    .map((i) => `M${point(i, major ? 144 : 153)}L${point(i, 162)}`)
    .join('')
const MINOR = ticks(false)
const MAJOR = ticks(true)
const RING = 'M200 20a180 180 0 1 1 0 360a180 180 0 1 1 0-360'
const ARC = 0.25

/** İmza anı: zaman kadranı çizilir, lacivert yay çeyrek tur ilerler, HGS Park logosu soldan sağa açılır. */
function Emblem() {
  const reduce = Boolean(useReducedMotion())
  const ref = useRef<HTMLDivElement>(null)
  // Kırpılan logo kendi görünürlüğünü bildiremez; tetik kırpılmamış kapsayıcıdan gelir.
  const inView = useInView(ref, { once: true, amount: 0.35 })
  // Dönüş kullanıcı kaydırınca başlar; ilk yüklemede çentikler yayın başladığı tepe noktasıyla hizalı kalır.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const turn = useTransform(scrollYProgress, [0, 1], [0, 30])
  const go = reduce || inView

  const draw = (duration: number, delay: number, to = 1) => ({
    initial: reduce ? false : { pathLength: 0, opacity: 0 },
    animate: go ? { pathLength: to, opacity: 1 } : undefined,
    transition: { duration, delay, ease: revealEase },
  })

  return (
    <div ref={ref} className={styles.emblem}>
      <svg className={styles.dial} viewBox="0 0 400 400" aria-hidden="true" focusable="false">
        <circle cx={C} cy={C} r="172" className={styles.disc} />
        <motion.path d={RING} className={styles.ring} {...draw(1.4, 0.1)} />
        <motion.g style={reduce ? undefined : { rotate: turn }}>
          <circle cx={C} cy={C} r="162" fill="none" />
          <motion.path d={MINOR} className={styles.minor} {...draw(1.7, 0.2)} />
          <motion.path d={MAJOR} className={styles.major} {...draw(1.7, 0.2)} />
        </motion.g>
        <motion.path d={RING} className={styles.arc} {...draw(1.3, 1.05, ARC)} />
        <motion.g
          initial={reduce ? false : { rotate: 0, opacity: 0 }}
          animate={go ? { rotate: ARC * 360, opacity: 1 } : undefined}
          transition={{ duration: 1.3, delay: 1.05, ease: revealEase }}
        >
          <circle cx={C} cy={C} r="185" fill="none" />
          <circle cx={C} cy="20" r="5.5" className={styles.hand} />
        </motion.g>
      </svg>

      <motion.div
        className={styles.logoClip}
        initial={reduce ? false : { clipPath: 'inset(0% 100% 0% 0%)' }}
        animate={go ? { clipPath: 'inset(0% 0% 0% 0%)' } : undefined}
        transition={{ duration: 1.15, delay: 0.5, ease: revealEase }}
      >
        <motion.div
          initial={reduce ? false : { scale: 1.06 }}
          animate={go ? { scale: 1 } : undefined}
          transition={{ duration: 1.4, delay: 0.5, ease: revealEase }}
        >
          <Picture
            src="/img/pages/hgs-park-logo.webp"
            avif="/img/pages/hgs-park-logo.avif"
            width={330}
            height={225}
            alt={hero.logoAlt}
            loading="eager"
            fetchPriority="high"
            className={styles.logo}
            pictureClassName={styles.picture}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}

export default function HgsParkHero() {
  const path = usePath()
  const reduce = Boolean(useReducedMotion())
  const titleId = useId()
  const rule = (origin: 'left' | 'right') => (
    <motion.span
      className={styles.rule}
      style={{ transformOrigin: `${origin} center` }}
      aria-hidden="true"
      initial={reduce ? false : { scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.9, delay: 0.2, ease: revealEase }}
    />
  )

  return (
    <section className={styles.hero} aria-labelledby={titleId}>
      <div className={styles.inner}>
        <Reveal as="p" className={styles.eyebrow} y={14} amount={0.1}>
          {rule('right')}
          {hero.eyebrow}
          {rule('left')}
        </Reveal>
        <Emblem />
        <TextReveal as="h1" id={titleId} className={styles.title} text={hero.title} delay={0.35} />
        <Reveal as="p" className={styles.lead} delay={0.55} y={20} amount={0.1}>
          {hero.lead}
        </Reveal>
        <Reveal className={styles.actions} delay={0.7} y={16} amount={0.1}>
          <Button href={`#${future.id}`} size="lg" arrow>
            {hero.primary}
          </Button>
          <Button to={path('contact')} variant="secondary" size="lg">
            {hero.secondary}
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
