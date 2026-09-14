/**
 * Kullanım: <Field label="Ek Mesaj" name="message"><Textarea name="message" rows={4} placeholder="…" /></Field>
 */
import type { TextareaHTMLAttributes } from 'react'
import { useFieldControl } from './FieldContext.ts'
import styles from './controls.module.css'

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean
}

export default function Textarea({ invalid, id, required, rows = 4, className = '', 'aria-describedby': describedBy, ...rest }: TextareaProps) {
  const control = useFieldControl({ id, describedBy, invalid, required })

  return (
    <textarea
      {...rest}
      id={control.id}
      rows={rows}
      required={control.required || undefined}
      aria-required={control.required || undefined}
      aria-describedby={control.describedBy}
      aria-invalid={control.invalid || undefined}
      className={`${styles.control} ${styles.textarea} ${className}`.trim()}
    />
  )
}
