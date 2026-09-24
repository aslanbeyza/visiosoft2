
import type { InputHTMLAttributes } from 'react'
import { useFieldControl } from './FieldContext.ts'
import styles from './controls.module.css'

export type TextInputType = 'text' | 'email' | 'tel' | 'url' | 'number' | 'password' | 'search'

export type TextInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> & {
  type?: TextInputType

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
