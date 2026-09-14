import Form, { Field, FormRow, TextInput, Textarea } from '../../components/Form/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { useTurnstile } from '../../hooks/useTurnstile/index.ts'
import { submitLead } from '../../services/index.ts'
import { quoteCopy } from './quoteCopy.ts'
import type { PackageItem, QuoteChoices } from './quoteRules.ts'
import { BackButton, StepHeader } from './StepParts.tsx'
import styles from './QuoteSteps.module.css'

type StepContactProps = {
  choices: QuoteChoices
  items: PackageItem[]
  onBack: () => void
  onSuccess: () => void
  autoFocus: boolean
  total: number
}

const { contact } = quoteCopy
const text = (data: FormData, key: string) => String(data.get(key) ?? '').trim()

/** 3. adım: iletişim bilgileri; seçimler ve önerilen ürünler mevcut sözleşmeyle gönderilir. */
export default function StepContact({ choices, items, onBack, onSuccess, autoFocus, total }: StepContactProps) {
  const { config } = useLocale()
  const siteKey = config?.turnstile_site_key || undefined
  const { ref: turnstileRef, token, ready, reset } = useTurnstile(siteKey)

  const submit = (data: FormData) => {
    const projectType = choices.projectType || 'paid'
    const body = {
      name: text(data, 'name'),
      email: text(data, 'email'),
      phone: text(data, 'phone'),
      company: text(data, 'company'),
      message: text(data, 'message'),
      website_url: String(data.get('website_url') ?? ''),
      'cf-turnstile-response': String(data.get('cf-turnstile-response') || token || 'local-dev'),
      project_type: projectType,
      needs_barrier: choices.barrier === 'yes',
      needs_turnkey_installation: choices.installation === 'yes',
      payment_methods: projectType === 'paid' ? choices.payments : [],
      products: items.map((item) => ({ id: item.id, name: item.name, qty: 1, isFree: false })),
    }
    return submitLead('parking-quote-engine', body)
  }

  return (
    <div className={styles.step}>
      <StepHeader index={2} total={total} title={contact.title} lead={contact.subtitle} autoFocus={autoFocus} />
      <Form
        label={contact.formLabel}
        onSubmit={submit}
        submitLabel={contact.submit}
        sendingLabel={contact.sending}
        successTitle={contact.successTitle}
        successBody={contact.successBody}
        errorFallback={contact.error}
        hiddenValues={{ 'cf-turnstile-response': token }}
        busy={!ready}
        onSuccess={() => {
          reset()
          onSuccess()
        }}
        footer={<BackButton onBack={onBack} />}
        className={styles.form}
      >
        <FormRow columns={2} className={styles.pair}>
          <Field label={contact.name} name="name" required className={styles.pairField}>
            <TextInput name="name" autoComplete="name" required />
          </Field>
          <Field label={contact.phone} name="phone" required className={styles.pairField}>
            <TextInput name="phone" type="tel" autoComplete="tel" inputMode="tel" required />
          </Field>
        </FormRow>
        <FormRow columns={2} className={styles.pair}>
          <Field label={contact.email} name="email" required className={styles.pairField}>
            <TextInput name="email" type="email" autoComplete="email" required />
          </Field>
          <Field label={contact.company} name="company" className={styles.pairField}>
            <TextInput name="company" autoComplete="organization" />
          </Field>
        </FormRow>
        <Field label={contact.note} name="message">
          <Textarea name="message" rows={4} placeholder={contact.notePlaceholder} />
        </Field>
        {siteKey ? <div ref={turnstileRef} className={styles.turnstile} /> : null}
      </Form>
    </div>
  )
}
