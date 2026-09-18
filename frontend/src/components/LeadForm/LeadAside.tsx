import DirectContact from './DirectContact.tsx'
import NextSteps from './NextSteps.tsx'
import type { NextStepsProps } from './NextSteps.tsx'
import { leadPageCopy } from './leadPageCopy.ts'
import styles from './LeadAside.module.css'

type LeadAsideProps = {
  steps: NextStepsProps['steps']
  /** İletişim sayfasında "Tüm iletişim kanalları" bağlantısını gizler. */
  showContactLink?: boolean
  /** WhatsApp kutucuğunda numara yerine gösterilecek metin. */
  whatsappValue?: string
}

/** Form sayfalarının yan paneli: sonraki adımlar + doğrudan iletişim (WhatsApp / e-posta). */
export default function LeadAside({ steps, showContactLink = true, whatsappValue }: LeadAsideProps) {
  return (
    <div className={styles.stack}>
      <NextSteps eyebrow={leadPageCopy.nextSteps.eyebrow} title={leadPageCopy.nextSteps.title} steps={steps} />
      <DirectContact showContactLink={showContactLink} whatsappValue={whatsappValue} />
    </div>
  )
}
