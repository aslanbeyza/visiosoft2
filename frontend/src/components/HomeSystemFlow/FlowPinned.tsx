import { useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import FlowStage from './FlowStage.tsx'
import FlowSteps from './FlowSteps.tsx'
import { STORY_LENGTH, TOTAL_STEPS, progressToFill, stepMidProgress } from './flowData.ts'
import { homeSystemFlowCopy as text } from './homeSystemFlowCopy.ts'
import styles from './HomeSystemFlow.module.css'

export default function FlowPinned() {
  const storyRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: storyRef, offset: ['start start', 'end end'] })
  const fill = useTransform(scrollYProgress, progressToFill)
  const [active, setActive] = useState(0)

  useMotionValueEvent(fill, 'change', (value) => {
    const next = Math.min(TOTAL_STEPS - 1, Math.max(0, Math.floor(value)))
    if (next !== active) setActive(next)
  })

  const select = (index: number) => {
    const story = storyRef.current
    if (!story) return
    const top = story.getBoundingClientRect().top + window.scrollY
    const distance = story.offsetHeight - window.innerHeight
    window.scrollTo({ top: top + distance * stepMidProgress(index), behavior: 'smooth' })
  }

  return (
    <div ref={storyRef} className={styles.story} data-story style={{ '--story': STORY_LENGTH } as CSSProperties}>
      <div className={styles.sticky}>
        <div className={styles.grid}>
          <FlowSteps
            steps={text.steps}
            active={active}
            fill={fill}
            onSelect={select}
            variant="pinned"
            label={text.stepsLabel}
            heading={text.legend}
          />
          <FlowStage active={active} fill={fill} dock />
        </div>
      </div>
    </div>
  )
}
