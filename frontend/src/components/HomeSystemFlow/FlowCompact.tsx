import { useRef, useState } from 'react'
import { useInView, useMotionValue } from 'framer-motion'
import { usePageVisible } from '../../hooks/usePageVisible/index.ts'
import FlowStage from './FlowStage.tsx'
import FlowSteps from './FlowSteps.tsx'
import { TOTAL_STEPS } from './flowData.ts'
import { homeSystemFlowCopy as text } from './homeSystemFlowCopy.ts'
import { useAutoAdvance } from './useAutoAdvance.ts'
import styles from './HomeSystemFlow.module.css'

export default function FlowCompact() {
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, { amount: 0.35 })
  const pageVisible = usePageVisible()
  const [paused, setPaused] = useState(false)
  const fill = useMotionValue(0)
  const { active, cycle, select } = useAutoAdvance({
    count: TOTAL_STEPS,
    duration: 3.4,
    lastDuration: 5,
    running: inView && pageVisible && !paused,
    fill,
  })

  const onSelect = (index: number) => {
    select(index)
    setPaused(true)
  }

  const toggle = (
    <button
      type="button"
      className={styles.toggle}
      aria-label={paused ? text.play : text.pause}
      onClick={() => setPaused((value) => !value)}
    >
      <svg viewBox="0 0 16 16" className={styles.toggleIcon} fill="currentColor" aria-hidden="true">
        {paused ? <path d="M5 3.2v9.6L12.6 8z" /> : <path d="M4.5 3h2.2v10H4.5zM9.3 3h2.2v10H9.3z" />}
      </svg>
      <span aria-hidden="true">{paused ? text.playShort : text.pauseShort}</span>
    </button>
  )

  return (
    <div ref={rootRef} className={styles.compact}>
      <FlowStage active={active} fill={fill} cycle={cycle} footer={toggle} />
      <FlowSteps
        steps={text.steps}
        active={active}
        fill={fill}
        onSelect={onSelect}
        variant="compact"
        label={text.stepsLabel}
        heading={text.legend}
      />
    </div>
  )
}
