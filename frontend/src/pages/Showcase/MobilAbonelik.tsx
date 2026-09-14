import FeatureGrid, { CardIcon, PhoneIcon, PlateIcon } from '../../components/FeatureGrid/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import StepList from '../../components/StepList/index.ts'
import PhoneFan from './PhoneFan.tsx'
import ShowcaseLayout from './ShowcaseLayout.tsx'
import { howToCopy, mobilFeaturesCopy, phoneFanCopy, phoneScreens } from './mobilAbonelikCopy.ts'
import styles from './ShowcaseLayout.module.css'

const icons = { abonelik: <CardIcon />, arac: <PlateIcon />, yardim: <PhoneIcon /> }

/** /mobil-uygulama-ile-park-aboneligi — hero anı: gerçek uygulama ekranları telefon çerçevelerinde yelpaze gibi açılır. */
export default function MobilAbonelik() {
  return (
    <ShowcaseLayout route="mobil-abonelik" relatedTone="paper">
      <Section tone="surface" spacing="lg" labelledBy={phoneFanCopy.id}>
        <div className={`${styles.stack} ${styles.stackCenter}`}>
          <SectionHeading id={phoneFanCopy.id} align="center" eyebrow={phoneFanCopy.eyebrow} title={phoneFanCopy.title} />
          <PhoneFan screens={phoneScreens} label={phoneFanCopy.label} caption={phoneFanCopy.caption} />
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
