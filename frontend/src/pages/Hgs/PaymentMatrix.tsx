import { useState } from 'react'
import ParkingFlow from '../../components/ParkingFlow/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import MethodRoutes from './MethodRoutes.tsx'
import MethodTiles from './MethodTiles.tsx'
import { hgsPageCopy } from './hgsPageCopy.ts'
import type { MethodKey } from './hgsPageCopy.ts'
import styles from './PaymentMatrix.module.css'

const { matrix } = hgsPageCopy
const headingId = `${matrix.id}-baslik`

export default function PaymentMatrix() {
  const [selected, setSelected] = useState<MethodKey>('hgs')
  const index = Math.max(0, matrix.methods.findIndex((item) => item.key === selected))
  const method = matrix.methods[index]

  return (
    <Section id={matrix.id} tone="night" spacing="none" labelledBy={headingId} className={styles.section}>
      <div className={styles.head}>
        <SectionHeading id={headingId} eyebrow={matrix.eyebrow} title={matrix.title} lead={matrix.lead} tone="dark" />
      </div>
      <div className={styles.grid}>
        <MethodTiles methods={matrix.methods} selected={selected} onSelect={setSelected} label={matrix.groupLabel} />
        <div className={styles.stage}>
          <ParkingFlow
            steps={matrix.flowSteps}
            mode="manual"
            active={index}
            onActiveChange={(next) => setSelected(matrix.methods[next].key)}
            highlight={method.device}
            highlightLabel={method.deviceLabel}
            tone="dark"
            showLabels={false}
            label={matrix.sceneLabel}
            caption={matrix.caption}
          />
          <div className={styles.route}>
            <MethodRoutes methods={matrix.methods} selected={selected} label={matrix.routeLabel} />
          </div>
        </div>
      </div>
    </Section>
  )
}
