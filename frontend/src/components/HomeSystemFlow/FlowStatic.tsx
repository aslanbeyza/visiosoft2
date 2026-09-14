import ParkingFlow from '../ParkingFlow/index.ts'
import FlowSteps from './FlowSteps.tsx'
import SessionsFrame from './SessionsFrame.tsx'
import { RECORD_INDEX, flowSteps } from './flowData.ts'
import { homeSystemFlowCopy as text } from './homeSystemFlowCopy.ts'
import styles from './HomeSystemFlow.module.css'

/** Hareket azaltma: bariyeri açık statik sahne, tüm adımlar ve oturumlar ekranı birlikte görünür. */
export default function FlowStatic() {
  return (
    <div className={styles.static}>
      <FlowSteps steps={text.steps} active={-1} variant="static" label={text.stepsLabel} />
      <div className={styles.staticMedia}>
        <div className={styles.staticScene}>
          <div inert>
            <ParkingFlow
              steps={flowSteps}
              mode="manual"
              active={RECORD_INDEX - 1}
              showLabels={false}
              label={text.sceneLabel}
            />
          </div>
          <p className="sr-only">{text.sceneDescription}</p>
        </div>
        <SessionsFrame />
      </div>
    </div>
  )
}
