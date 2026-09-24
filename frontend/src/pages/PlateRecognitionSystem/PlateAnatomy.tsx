import { useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import PlateAnatomySvg from './PlateAnatomySvg.tsx'
import type { AnatomyValues } from './PlateAnatomySvg.tsx'
import { prsCopy } from './prsCopy.ts'
import styles from './PlateAnatomy.module.css'

const STAGE_AT = [0.4, 0.68, 0.9]

const finalValues: AnatomyValues = {
  frame: 1,
  car: 1,
  lockScale: 1,
  lockOpacity: 1,
  plateOpacity: 1,
  plateY: 0,
  cellOpacity: 1,
  cellX: [-10, 0, 10],
}

export default function PlateAnatomy() {
  const reduce = Boolean(useReducedMotion())
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start 0.9', 'end 0.5'] })

  const frame = useTransform(p, [0, 0.2], [0, 1])
  const car = useTransform(p, [0.08, 0.34], [0, 1])
  const lockScale = useTransform(p, [0.3, 0.46], [1.8, 1])
  const lockOpacity = useTransform(p, [0.3, 0.4], [0, 1])
  const plateOpacity = useTransform(p, [0.48, 0.62], [0, 1])
  const plateY = useTransform(p, [0.48, 0.66], [-28, 0])
  const cellOpacity = useTransform(p, [0.64, 0.76], [0, 1])
  const left = useTransform(p, [0.7, 0.9], [0, -10])
  const right = useTransform(p, [0.7, 0.9], [0, 10])

  const [stage, setStage] = useState(-1)
  useMotionValueEvent(p, 'change', (value) => {
    const next = STAGE_AT.filter((at) => value >= at).length - 1
    setStage((current) => (current === next ? current : next))
  })

  const values: AnatomyValues = reduce
    ? finalValues
    : { frame, car, lockScale, lockOpacity, plateOpacity, plateY, cellOpacity, cellX: [left, 0, right] }
  const active = reduce ? STAGE_AT.length - 1 : stage
  const { about } = prsCopy

  return (
    <figure ref={ref} className={styles.root}>
      <div className={styles.canvas} role="img" aria-label={about.diagramLabel}>
        <PlateAnatomySvg v={values} />
      </div>
      <ol className={styles.stages}>
        {about.stages.map((item, index) => (
          <li
            key={item.key}
            className={styles.stage}
            data-on={index <= active}
            aria-current={index === active ? 'step' : undefined}
          >
            <span className={styles.index} aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <strong className={styles.stageTitle}>{item.title}</strong>
            <span className={styles.stageText}>{item.text}</span>
          </li>
        ))}
      </ol>
      <figcaption className={styles.note}>{about.diagramNote}</figcaption>
    </figure>
  )
}
