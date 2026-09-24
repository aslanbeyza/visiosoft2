import { useState } from 'react'
import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { submitLead } from '../../services/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { useTurnstile } from '../../hooks/useTurnstile/index.ts'
import { ChoiceCardGroup, Field, Form, FormRow, TextInput, Textarea } from '../Form/index.ts'
import { revealEase } from '../Reveal/index.ts'
import { buildLeadBody } from './buildLeadBody.ts'
import type { LeadExtraFields, LeadKind } from './buildLeadBody.ts'
import ParkingFields from './ParkingFields.tsx'
import { leadFormCopy as copy } from './leadFormCopy.ts'
import styles from './LeadForm.module.css'

export type LeadFormProps = {
  kind: LeadKind
  extraFields?: LeadExtraFields
  submitLabel?: string
  successTitle?: string
  successBody?: string

  messageExample?: string
  /** Lets the visitor pick what the request is about; the chosen kind is sent instead of `kind` (discovery adds the address field). */
  topics?: { legend: string; options: { kind: LeadKind; label: string }[]; initial?: LeadKind }

  label?: string
  id?: string
  className?: string
}

const stack: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }
const row: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: revealEase } },
}

function Row({ children }: { children: ReactNode }) {
  return (
    <motion.div className={styles.row} variants={row}>
      {children}
    </motion.div>
  )
}

export default function LeadForm({
  kind,
  extraFields,
  submitLabel,
  successTitle,
  successBody,
  messageExample,
  topics,
  label,
  id,
  className,
}: LeadFormProps) {
  const reduce = Boolean(useReducedMotion())
  const { config } = useLocale()
  const siteKey = config?.turnstile_site_key || undefined
  const { ref: turnstileRef, token, ready, error: turnstileFailed, reset: resetTurnstile } = useTurnstile(siteKey)

  const [leadKind, setLeadKind] = useState<LeadKind>(topics?.initial ?? kind)
  const leadFields: LeadExtraFields | undefined = leadKind === 'discovery' ? 'address' : extraFields
  const topicOptions = topics?.options.map((option) => ({ value: option.kind, label: option.label })) ?? []
  const selectTopic = (value: string) => {
    const option = topics?.options.find((item) => item.kind === value)
    if (option) setLeadKind(option.kind)
  }

  const onSubmit = (data: FormData) => submitLead(leadKind, buildLeadBody(data, leadFields, token))

  const note = siteKey && turnstileFailed ? copy.turnstileError : siteKey && !ready ? copy.turnstileWaiting : copy.required

  return (
    <Form
      id={id}
      className={className}
      label={label}
      onSubmit={onSubmit}
      submitLabel={submitLabel ?? copy.submit}
      sendingLabel={copy.sending}
      successTitle={successTitle ?? copy.successTitle}
      successBody={successBody ?? copy.successBody}
      errorFallback={copy.errorFallback}
      resetLabel={copy.reset}
      hiddenValues={{ 'cf-turnstile-response': token }}
      busy={!ready}
      onSuccess={resetTurnstile}
      onReset={resetTurnstile}
      footer={
        <p className={styles.note} aria-live="polite">
          {note}
        </p>
      }
    >
      <motion.div
        className={styles.stack}
        variants={stack}
        initial={reduce ? false : 'hidden'}
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        {topics ? (
          <Row>
            <ChoiceCardGroup type="radio" name="topic" legend={topics.legend} options={topicOptions} value={leadKind} onChange={selectTopic} columns={3} />
          </Row>
        ) : null}
        <Row>
          <FormRow columns={2} className={styles.pair}>
            <Field label={copy.fields.name} name="name" required className={styles.pairField}>
              <TextInput name="name" autoComplete="name" size="lg" />
            </Field>
            <Field label={copy.fields.phone} name="phone" hint={copy.hints.phone} required className={styles.pairField}>
              <TextInput name="phone" type="tel" inputMode="tel" autoComplete="tel" size="lg" />
            </Field>
          </FormRow>
        </Row>
        <Row>
          <FormRow columns={2} className={styles.pair}>
            <Field label={copy.fields.email} name="email" required className={styles.pairField}>
              <TextInput name="email" type="email" inputMode="email" autoComplete="email" size="lg" />
            </Field>
            <Field label={copy.fields.company} name="company" hint={copy.fields.optional} className={styles.pairField}>
              <TextInput name="company" autoComplete="organization" size="lg" />
            </Field>
          </FormRow>
        </Row>
        {leadFields === 'address' ? (
          <Row>
            <Field label={copy.fields.address} name="address" required>
              <Textarea name="address" rows={2} autoComplete="street-address" placeholder={copy.examples.address} />
            </Field>
          </Row>
        ) : null}
        {leadFields === 'parking' ? (
          <Row>
            <ParkingFields />
          </Row>
        ) : null}
        <Row>
          <Field label={copy.fields.message} name="message" hint={copy.fields.optional}>
            <Textarea name="message" rows={4} placeholder={messageExample} />
          </Field>
        </Row>
        {siteKey ? (
          <Row>
            <div ref={turnstileRef} className={styles.turnstile} />
          </Row>
        ) : null}
      </motion.div>
    </Form>
  )
}
