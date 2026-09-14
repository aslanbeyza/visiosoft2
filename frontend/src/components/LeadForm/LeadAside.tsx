import DirectContact from './DirectContact.tsx'
import NextSteps from './NextSteps.tsx'
import type { NextStepsProps } from './NextSteps.tsx'
import { leadPageCopy } from './leadPageCopy.ts'
import styles from './LeadAside.module.css'

/** Form sayfalarının yan paneli: sonraki adımlar + doğrudan iletişim. */
export default function LeadAside({ steps }: { steps: NextStepsProps['steps'] }) {
  return (
    <div className={styles.stack}>
      <NextSteps eyebrow={leadPageCopy.nextSteps.eyebrow} title={leadPageCopy.nextSteps.title} steps={steps} />
      <DirectContact />
    </div>
  )
}
