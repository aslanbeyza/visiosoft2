/**
 * Kullanım:
 * <Field label="E-posta" name="email" hint="İş e-postanızı tercih edin." required>
 *   <TextInput name="email" type="email" autoComplete="email" />
 * </Field>
 * veya render-prop ile:
 * <Field label="Adres" name="address" required>
 *   {(id, describedBy, meta) => <Textarea id={id} name="address" aria-describedby={describedBy} invalid={meta.invalid} required />}
 * </Field>
 * `error` verilmezse Form'un doğrulama/sunucu hatalarından `name` ile eşleşen mesaj otomatik gösterilir.
 */
import { useId } from 'react'
import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { revealEase } from '../Reveal/index.ts'
import { FieldContext } from './FieldContext.ts'
import { useFieldError } from './FormContext.ts'
import { formCopy } from './formCopy.ts'
import styles from './Field.module.css'

export type FieldRenderMeta = {
  name?: string
  invalid: boolean
  required: boolean
  errorId?: string
  hintId?: string
}

export type FieldProps = {
  label: string
  hint?: string
  error?: string
  required?: boolean
  /** Ek: Form hata özetiyle eşleşme için alan adı. */
  name?: string
  /** Ek: kontrol kimliği; verilmezse üretilir. */
  id?: string
  children: ReactNode | ((id: string, describedBy: string | undefined, meta: FieldRenderMeta) => ReactNode)
  className?: string
}

export function FieldErrorIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4.5M12 16h.01" />
    </svg>
  )
}

export default function Field({ label, hint, error, required = false, name, id, children, className = '' }: FieldProps) {
  const reduce = Boolean(useReducedMotion())
  const generatedId = useId()
  const controlId = id ?? generatedId
  const hintId = `${controlId}-hint`
  const errorId = `${controlId}-error`
  const contextError = useFieldError(name)
  const message = error ?? contextError
  const invalid = Boolean(message)
  const describedBy = [hint ? hintId : null, message ? errorId : null].filter(Boolean).join(' ') || undefined

  const meta: FieldRenderMeta = {
    name,
    invalid,
    required,
    errorId: message ? errorId : undefined,
    hintId: hint ? hintId : undefined,
  }

  const control =
    typeof children === 'function' ? (
      children(controlId, describedBy, meta)
    ) : (
      <FieldContext.Provider value={{ id: controlId, describedBy, invalid, required, name }}>{children}</FieldContext.Provider>
    )

  return (
    <div className={`${styles.field} ${className}`.trim()} data-invalid={invalid ? 'true' : undefined} data-field-label={label}>
      <label htmlFor={controlId} className={styles.label}>
        {label}
        {required ? (
          <>
            <span className={styles.required} aria-hidden="true">
              *
            </span>
            <span className={styles.srOnly}> ({formCopy.requiredMark})</span>
          </>
        ) : null}
      </label>
      {hint ? (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      ) : null}
      {control}
      {message ? (
        <motion.p
          id={errorId}
          className={styles.error}
          initial={reduce ? false : { opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: revealEase }}
        >
          <FieldErrorIcon className={styles.errorIcon} />
          <span>{message}</span>
        </motion.p>
      ) : null}
    </div>
  )
}
