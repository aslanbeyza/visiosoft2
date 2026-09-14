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

/**
 * Sayfanın imza anı: HGS / POS / QR yöntem kutucukları. Üzerine gelinen, odaklanılan ya da seçilen yöntemin
 * akıştaki yeri ParkingFlow sahnesinde (manual) vurgulanır: HGS → kontrol kutusunda eşleşme, POS → kioskta ödeme,
 * QR → telefondan ödeme sonrası bariyer. Sahnenin hemen altında seçili yöntemin üç adımlık rotası durur;
 * ≥1024px'te kutucuk sütunu ile sahne + rota sütunu üstten ve alttan hizalıdır.
 */
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
