import { useId } from 'react'
import ParkingFlow, { parkingFlowSteps } from '../../components/ParkingFlow/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import { detailCopy } from './detailShared.ts'
import type { DetailPlacement as DetailPlacementData } from './detailTypes.ts'
import styles from './DetailPlacement.module.css'

type DetailPlacementProps = {
  placement: DetailPlacementData
}

export default function DetailPlacement({ placement }: DetailPlacementProps) {
  const titleId = useId()

  return (
    <Section id="sistemdeki-yeri" tone="night" spacing="lg" labelledBy={titleId}>
      <div className={styles.head}>
        <SectionHeading eyebrow={placement.eyebrow} title={placement.title} lead={placement.lead} id={titleId} tone="dark" />
      </div>
      <div className={styles.flow}>
        <ParkingFlow
          steps={parkingFlowSteps}
          mode="auto"
          pin={false}
          highlight={placement.device}
          highlightLabel={placement.deviceLabel}
          tone="dark"
          label={`${placement.deviceLabel}: geçiş şeridindeki yeri`}
          caption={detailCopy.placement.caption}
        />
      </div>
    </Section>
  )
}
