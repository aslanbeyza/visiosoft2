import { useId } from 'react'
import { FeatureIcon } from '../../components/FeatureGrid/index.ts'
import MediaFrame from '../../components/MediaFrame/index.ts'
import Picture from '../../components/Picture/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import StepList from '../../components/StepList/index.ts'
import type { DetailProcess as DetailProcessData } from './detailTypes.ts'
import styles from './DetailSections.module.css'

type DetailProcessProps = {
  process: DetailProcessData
}

export default function DetailProcess({ process }: DetailProcessProps) {
  const titleId = useId()
  const steps = process.steps.map((step) => ({
    title: step.title,
    description: step.description,
    icon: <FeatureIcon name={step.icon} />,
  }))
  const heading = <SectionHeading eyebrow={process.eyebrow} title={process.title} lead={process.lead} id={titleId} />

  if (!process.media) {
    return (
      <Section id="sahada" tone="surface" spacing="lg" labelledBy={titleId}>
        {heading}
        <div className={styles.body}>
          <StepList steps={steps} direction="horizontal" />
        </div>
      </Section>
    )
  }

  const { image, caption } = process.media

  return (
    <Section id="sahada" tone="surface" spacing="lg" labelledBy={titleId}>
      <div className={styles.processSplit}>
        <div className={styles.processCopy}>
          {heading}
          <div className={styles.body}>
            <StepList steps={steps} direction="vertical" />
          </div>
        </div>
        <MediaFrame ratio={`${image.width} / ${image.height}`} caption={caption} className={styles.processMedia}>
          <Picture
            src={image.src}
            avif={image.avifSet}
            webp={image.webpSet}
            sizes="(min-width: 1024px) 40rem, 100vw"
            alt={image.alt}
            width={image.width}
            height={image.height}
          />
        </MediaFrame>
      </div>
    </Section>
  )
}
