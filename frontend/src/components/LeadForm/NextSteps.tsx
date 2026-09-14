import { useId } from 'react'
import StepList from '../StepList/index.ts'
import TextReveal from '../TextReveal/index.ts'
import styles from './LeadAside.module.css'

export type NextStepsProps = {
  eyebrow: string
  title: string
  steps: { title: string; description: string }[]
}

/** "Sonraki adımlar": dikey adım listesi; çizgi kaydırmayla dolar, çizgi ulaşan adım etkinleşir. */
export default function NextSteps({ eyebrow, title, steps }: NextStepsProps) {
  const titleId = useId()

  return (
    <section className={styles.block} aria-labelledby={titleId}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <TextReveal as="h2" id={titleId} className={styles.title} text={title} />
      <StepList direction="vertical" progress="scroll" steps={steps} headingAs="h3" label={title} className={styles.steps} />
    </section>
  )
}
