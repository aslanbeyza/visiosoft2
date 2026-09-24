
import type { SelectHTMLAttributes } from 'react'
import { useFieldControl } from './FieldContext.ts'
import styles from './controls.module.css'

export type SelectOption = { value: string; label: string; disabled?: boolean }

export type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> & {
  options?: SelectOption[]
  placeholder?: string
  invalid?: boolean
}

export default function Select({
  options,
  placeholder,
  invalid,
  id,
  required,
  className = '',
  children,
  value,
  defaultValue,
  'aria-describedby': describedBy,
  ...rest
}: SelectProps) {
  const control = useFieldControl({ id, describedBy, invalid, required })
  const controlled = value !== undefined
  const initial = controlled ? undefined : (defaultValue ?? (placeholder ? '' : undefined))

  return (
    <span className={styles.selectWrap}>
      <select
        {...rest}
        id={control.id}
        required={control.required || undefined}
        aria-required={control.required || undefined}
        aria-describedby={control.describedBy}
        aria-invalid={control.invalid || undefined}
        className={`${styles.control} ${styles.select} ${className}`.trim()}
        value={controlled ? value : undefined}
        defaultValue={initial}
      >
        {placeholder ? (
          <option value="" disabled={control.required}>
            {placeholder}
          </option>
        ) : null}
        {options?.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
        {children}
      </select>
      <svg viewBox="0 0 24 24" className={styles.chevron} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </span>
  )
}
