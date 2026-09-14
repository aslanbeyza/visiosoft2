/**
 * Kullanım:
 * <Checkbox name="needs_barrier" label="Bariyer" description="Fiziksel geçiş kontrolü" />
 * <Checkbox name="payment_methods" value="hgs" label="HGS" checked={hgs} onChange={setHgs} />
 * Onay işareti CSS ile çizilir; hata verilmezse Form'un `name` ile eşleşen hatası gösterilir.
 */
import { useId } from 'react'
import type { ChangeEvent, ReactNode } from 'react'
import { FieldErrorIcon } from './Field.tsx'
import { useFieldError } from './FormContext.ts'
import styles from './Checkbox.module.css'

export type CheckboxProps = {
  name: string
  label: ReactNode
  description?: string
  value?: string
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  disabled?: boolean
  invalid?: boolean
  error?: string
  id?: string
  className?: string
}

export default function Checkbox({
  name,
  label,
  description,
  value,
  checked,
  defaultChecked,
  onChange,
  required = false,
  disabled = false,
  invalid,
  error,
  id,
  className = '',
}: CheckboxProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const descriptionId = `${inputId}-desc`
  const errorId = `${inputId}-error`
  const contextError = useFieldError(name)
  const message = error ?? contextError
  const isInvalid = invalid ?? Boolean(message)
  const describedBy = [description ? descriptionId : null, message ? errorId : null].filter(Boolean).join(' ') || undefined

  return (
    <div className={`${styles.root} ${className}`.trim()}>
      <label className={styles.row} htmlFor={inputId}>
        <input
          id={inputId}
          className={styles.input}
          type="checkbox"
          name={name}
          value={value}
          checked={checked}
          defaultChecked={defaultChecked}
          required={required || undefined}
          disabled={disabled}
          aria-describedby={describedBy}
          aria-invalid={isInvalid || undefined}
          onChange={onChange ? (event) => onChange(event.target.checked, event) : undefined}
        />
        <span className={styles.box} aria-hidden="true">
          <svg viewBox="0 0 16 16" className={styles.checkSvg} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" focusable="false">
            <path className={styles.check} d="m3.5 8.4 2.9 2.9 6.1-6.3" pathLength="1" />
          </svg>
        </span>
        <span className={styles.text}>
          <span className={styles.label}>{label}</span>
          {description ? (
            <span id={descriptionId} className={styles.description}>
              {description}
            </span>
          ) : null}
        </span>
      </label>
      {message ? (
        <p id={errorId} className={styles.error}>
          <FieldErrorIcon className={styles.errorIcon} />
          <span>{message}</span>
        </p>
      ) : null}
    </div>
  )
}
