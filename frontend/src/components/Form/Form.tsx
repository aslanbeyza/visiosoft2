
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { FormEvent, MouseEvent, ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Button from '../Button/index.ts'
import { revealEase } from '../Reveal/index.ts'
import { FormKitContext } from './FormContext.ts'
import type { FieldErrors, FormStatus } from './FormContext.ts'
import { formCopy } from './formCopy.ts'
import { HONEYPOT_NAME, collectNativeErrors, toFieldErrors } from './validation.ts'
import styles from './Form.module.css'

export type FormResult = { message: string }

export type FormProps = {

  onSubmit: (data: FormData) => Promise<FormResult>
  children: ReactNode
  submitLabel: string
  sendingLabel: string
  successTitle: string

  successBody?: string

  errorFallback: string

  resetLabel?: string

  validate?: (data: FormData) => Record<string, string> | null | undefined

  hiddenValues?: Record<string, string>

  busy?: boolean

  footer?: ReactNode

  onReset?: () => void
  onSuccess?: (result: FormResult) => void
  id?: string
  className?: string

  label?: string
}

type State = {
  status: FormStatus
  message: string
  errors: FieldErrors
  attempt: number
}

const INITIAL: State = { status: 'idle', message: '', errors: {}, attempt: 0 }
const FIRST_CONTROL = 'input:not([type="hidden"]):not([tabindex="-1"]), select, textarea'

function describeError(error: unknown, form: HTMLFormElement | null, fallback: string) {
  const source = error && typeof error === 'object' ? (error as { message?: unknown; status?: unknown; errors?: unknown }) : null
  const errors = toFieldErrors(source?.errors, form)
  const hasServerMessage = typeof source?.status === 'number' && typeof source.message === 'string' && source.message.length > 0
  return { message: hasServerMessage ? String(source.message) : fallback, errors }
}

function AlertIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4.5M12 16h.01" />
    </svg>
  )
}

export default function Form({
  onSubmit,
  children,
  submitLabel,
  sendingLabel,
  successTitle,
  successBody,
  errorFallback,
  resetLabel,
  validate,
  hiddenValues,
  busy = false,
  footer,
  onReset,
  onSuccess,
  id,
  className = '',
  label,
}: FormProps) {
  const reduce = Boolean(useReducedMotion())
  const honeypotId = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const summaryRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLDivElement>(null)
  const focusFirst = useRef(false)
  const [state, setState] = useState<State>(INITIAL)
  const { status, message, errors, attempt } = state

  const sending = status === 'sending'
  const entries = Object.entries(errors)
  const showSummary = status === 'error' && (entries.length > 0 || message.length > 0)

  const context = useMemo(() => ({ status, errors }), [status, errors])

  useEffect(() => {
    if (status === 'error') summaryRef.current?.focus()
  }, [status, attempt])

  useEffect(() => {
    if (status === 'success') {
      successRef.current?.focus()
      return
    }
    if (status === 'idle' && focusFirst.current) {
      focusFirst.current = false
      formRef.current?.querySelector<HTMLElement>(FIRST_CONTROL)?.focus()
    }
  }, [status])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (sending) return
    const form = event.currentTarget
    const data = new FormData(form)

    if (hiddenValues) {
      for (const [key, value] of Object.entries(hiddenValues)) {
        if (!String(data.get(key) ?? '')) data.set(key, value)
      }
    }

    const found: FieldErrors = { ...collectNativeErrors(form), ...toFieldErrors(validate?.(data), form) }
    if (Object.keys(found).length > 0) {
      setState((previous) => ({ status: 'error', message: '', errors: found, attempt: previous.attempt + 1 }))
      return
    }

    setState((previous) => ({ ...previous, status: 'sending', message: '', errors: {} }))

    try {
      const result = await onSubmit(data)
      formRef.current?.reset()
      setState((previous) => ({ ...previous, status: 'success', message: result.message, errors: {} }))
      onSuccess?.(result)
    } catch (error) {
      const described = describeError(error, formRef.current, errorFallback)
      setState((previous) => ({ status: 'error', message: described.message, errors: described.errors, attempt: previous.attempt + 1 }))
    }
  }

  const reset = () => {
    focusFirst.current = true
    setState(INITIAL)
    onReset?.()
  }

  const focusField = (event: MouseEvent<HTMLAnchorElement>, targetId: string) => {
    const target = document.getElementById(targetId)
    if (!target) return
    event.preventDefault()
    target.focus()
    target.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <div className={`${styles.root} ${className}`.trim()} data-status={status}>
      <form
        ref={formRef}
        id={id}
        className={styles.form}
        noValidate
        hidden={status === 'success'}
        aria-label={label}
        onSubmit={handleSubmit}
      >
        <FormKitContext.Provider value={context}>
          <fieldset className={styles.fieldset} disabled={sending} aria-busy={sending || undefined}>
            {showSummary ? (
              <motion.div
                ref={summaryRef}
                key={attempt}
                role="alert"
                tabIndex={-1}
                className={styles.summary}
                initial={reduce ? false : { opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: revealEase }}
              >
                <AlertIcon className={styles.summaryIcon} />
                <div className={styles.summaryBody}>
                  <p className={styles.summaryTitle}>{entries.length > 0 ? formCopy.errorSummaryTitle : message}</p>
                  {entries.length > 0 && message ? <p className={styles.summaryText}>{message}</p> : null}
                  {entries.length > 0 ? (
                    <ul className={styles.summaryList}>
                      {entries.map(([name, entry]) => (
                        <li key={name}>
                          {entry.id ? (
                            <a href={`#${entry.id}`} className={styles.summaryLink} onClick={(event) => focusField(event, entry.id as string)}>
                              {entry.message}
                            </a>
                          ) : (
                            entry.message
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </motion.div>
            ) : null}

            <div className={styles.body}>{children}</div>

            {}
            <div className={styles.honeypot} aria-hidden="true">
              <label htmlFor={honeypotId}>{formCopy.honeypotLabel}</label>
              <input id={honeypotId} name={HONEYPOT_NAME} type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div className={styles.actions}>
              <Button type="submit" size="lg" disabled={sending || busy} className={styles.submit}>
                {sending ? <span className={styles.spinner} aria-hidden="true" /> : null}
                {sending ? sendingLabel : submitLabel}
              </Button>
              {footer ? <div className={styles.footer}>{footer}</div> : null}
            </div>
          </fieldset>
        </FormKitContext.Provider>
      </form>

      {status === 'success' ? (
        <motion.div
          ref={successRef}
          role="status"
          tabIndex={-1}
          className={styles.success}
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: revealEase }}
        >
          <svg viewBox="0 0 64 64" className={styles.successIcon} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <motion.circle
              cx="32"
              cy="32"
              r="29"
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, ease: revealEase }}
            />
            <motion.path
              d="M20 33.5l8.5 8.5L44 24"
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.55, delay: 0.55, ease: revealEase }}
            />
          </svg>
          <p className={styles.successTitle}>{successTitle}</p>
          {successBody || message ? <p className={styles.successBody}>{successBody ?? message}</p> : null}
          {resetLabel ? (
            <div className={styles.successActions}>
              <Button variant="secondary" onClick={reset}>
                {resetLabel}
              </Button>
            </div>
          ) : null}
        </motion.div>
      ) : null}
    </div>
  )
}
