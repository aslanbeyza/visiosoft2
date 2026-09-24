import FeatureGrid, { CardIcon, PhoneIcon, PlateIcon } from '../../components/FeatureGrid/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import StepList from '../../components/StepList/index.ts'
import ParkBizPhoneDemo from './ParkBizPhoneDemo.tsx'
import ShowcaseLayout from './ShowcaseLayout.tsx'
import { howToCopy, mobilFeaturesCopy } from './mobilAbonelikCopy.ts'
import { parkBizDemoCopy } from './parkBizDemoCopy.ts'
import styles from './ShowcaseLayout.module.css'

const icons = { abonelik: <CardIcon />, arac: <PlateIcon />, yardim: <PhoneIcon /> }

export default function MobilAbonelik() {
  return (
    <ShowcaseLayout route="mobil-abonelik" relatedTone="paper">
      <Section tone="surface" spacing="lg" labelledBy={parkBizDemoCopy.id}>
        <div className={`${styles.stack} ${styles.stackCenter}`}>
          <SectionHeading id={parkBizDemoCopy.id} align="center" eyebrow={parkBizDemoCopy.eyebrow} title={parkBizDemoCopy.title} />
          <ParkBizPhoneDemo />
        </div>
      </Section>

      <Section tone="paper" id={howToCopy.id} labelledBy={howToCopy.headingId}>
        <div className={styles.stack}>
          <SectionHeading id={howToCopy.headingId} eyebrow={howToCopy.eyebrow} title={howToCopy.title} />
          <StepList steps={howToCopy.steps} direction="horizontal" progress="scroll" label={howToCopy.title} />
        </div>
      </Section>

      <Section tone="surface" labelledBy={mobilFeaturesCopy.id}>
        <div className={styles.stack}>
          <SectionHeading id={mobilFeaturesCopy.id} eyebrow={mobilFeaturesCopy.eyebrow} title={mobilFeaturesCopy.title} />
          <FeatureGrid
            columns={3}
            label={mobilFeaturesCopy.title}
            items={mobilFeaturesCopy.items.map((item) => ({
              icon: icons[item.key as keyof typeof icons],
              title: item.title,
              description: item.description,
            }))}
          />
        </div>
      </Section>
    </ShowcaseLayout>
  )
}
