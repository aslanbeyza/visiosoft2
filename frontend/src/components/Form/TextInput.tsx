/**
 * Kullanım: <Field label="Telefon" name="phone" required><TextInput name="phone" type="tel" autoComplete="tel" /></Field>
 * Field içinde id / aria-describedby / required / aria-invalid otomatik gelir; dışarıda kullanılınca prop ile verin.
 */
import type { InputHTMLAttributes } from 'react'
import { useFieldControl } from './FieldContext.ts'
import styles from './controls.module.css'

export type TextInputType = 'text' | 'email' | 'tel' | 'url' | 'number' | 'password' | 'search'

export type TextInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> & {
  type?: TextInputType
  /** Hata durumunu işaretler (aria-invalid). Field içinde otomatik. */
  invalid?: boolean
  size?: 'md' | 'lg'
}

export default function TextInput({
  type = 'text',
  invalid,
  size = 'md',
  id,
  required,
  className = '',
  'aria-describedby': describedBy,
  ...rest
}: TextInputProps) {
  const control = useFieldControl({ id, describedBy, invalid, required })

  return (
    <input
      {...rest}
      id={control.id}
      type={type}
      required={control.required || undefined}
      aria-required={control.required || undefined}
      aria-describedby={control.describedBy}
      aria-invalid={control.invalid || undefined}
      className={`${styles.control} ${className}`.trim()}
      data-size={size}
    />
  )
}
