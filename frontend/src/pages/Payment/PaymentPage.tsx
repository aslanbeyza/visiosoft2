import { useEffect, useState } from 'react'
import Button from '../../components/Button/index.ts'
import IframeEmbed from '../../components/IframeEmbed/index.ts'
import PageHero from '../../components/PageHero/index.ts'
import Reveal from '../../components/Reveal/index.ts'
import Section from '../../components/Section/index.ts'
import Seo from '../../components/Seo/index.ts'
import { EmptyState, Skeleton } from '../../components/States/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import PaymentRail from './PaymentRail.tsx'
import { paymentCopy as copy } from './paymentCopy.ts'
import styles from './PaymentPage.module.css'

const CONFIG_WAIT_MS = 4000

export default function PaymentPage() {
  const path = usePath()
  const { config } = useLocale()
  const [waited, setWaited] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setWaited(true), CONFIG_WAIT_MS)
    return () => window.clearTimeout(timer)
  }, [])

  const raw = config?.payment_iframe?.trim() ?? ''
  const src = /^https:\/\//i.test(raw) ? raw : ''
  const pending = !config && !waited

  const actions = (
    <div className={styles.actions}>
      <Button to={path('bank-accounts')} variant="secondary">
        {copy.bank}
      </Button>
      <Button to={path('contact')} variant="secondary">
        {copy.contact}
      </Button>
    </div>
  )

  let stage
  if (pending) {
    stage = <Skeleton variant="text" count={6} label={copy.loading} />
  } else if (src) {
    stage = (
      <IframeEmbed
        src={src}
        title={copy.frameTitle}
        description={copy.frameDescription}
        loadOn="view"
        height="44rem"
        allow="payment"
        fallbackHref={src}
        fallbackLabel={copy.frameFallback}
      />
    )
  } else {
    stage = <EmptyState title={copy.emptyTitle} description={copy.emptyBody} action={actions} />
  }

  return (
    <>
      <Seo title={copy.seoTitle} description={copy.seoDescription} noindex />
      <PageHero variant="centered" tone="surface" eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead} aside={<PaymentRail />} />
      <Section tone="paper" spacing="lg" width="content">
        <div className={styles.stage} data-kind={src ? 'frame' : 'state'}>
          {stage}
        </div>
        {src ? (
          <Reveal className={styles.help} y={16} amount={0.4}>
            <div className={styles.helpCopy}>
              <p className={styles.helpTitle}>{copy.helpTitle}</p>
              <p className={styles.helpBody}>{copy.helpBody}</p>
            </div>
            {actions}
          </Reveal>
        ) : null}
      </Section>
    </>
  )
}
