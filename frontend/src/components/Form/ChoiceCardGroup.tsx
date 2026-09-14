/**
 * Kullanım:
 * <ChoiceCardGroup type="radio" name="project_type" legend="Otopark modelinizi seçin" value={type} onChange={setType}
 *   options={[{ value: 'paid', label: 'Ücretli otopark', description: '…', icon: <Icon /> }]} />
 * <ChoiceCardGroup type="checkbox" name="payment_methods" legend="Ödeme kanalları" value={methods} onChange={setMethods} options={…} />
 * Kartlar gerçek radio/checkbox girdileridir: ok tuşları (radio) ve boşluk ile seçilir; seçili kartın işareti çizilerek gelir.
 */
import { useId } from 'react'
import type { ReactNode } from 'react'
import { RevealGroup, RevealItem } from '../Reveal/index.ts'
import { FieldErrorIcon } from './Field.tsx'
import { useFieldError } from './FormContext.ts'
import { formCopy } from './formCopy.ts'
import styles from './ChoiceCardGroup.module.css'

export type ChoiceOption = {
  value: string
  label: string
  description?: string
  icon?: ReactNode
  disabled?: boolean
}

type ChoiceCardGroupBase = {
  name: string
  legend: string
  options: ChoiceOption[]
  hint?: string
  error?: string
  required?: boolean
  disabled?: boolean
  /** Ek: geniş ekranda sütun sayısı (varsayılan: seçenek sayısına göre 2 veya 3). */
  columns?: 1 | 2 | 3
  className?: string
}

export type ChoiceCardGroupProps = ChoiceCardGroupBase &
  (
    | { type: 'radio'; value: string; onChange: (value: string) => void }
    | { type: 'checkbox'; value: string[]; onChange: (value: string[]) => void }
  )

export default function ChoiceCardGroup(props: ChoiceCardGroupProps) {
  const { name, legend, options, hint, error, required = false, disabled = false, columns, className = '' } = props
  const baseId = useId()
  const hintId = `${baseId}-hint`
  const errorId = `${baseId}-error`
  const contextError = useFieldError(name)
  const message = error ?? contextError
  const invalid = Boolean(message)
  const describedBy = [hint ? hintId : null, message ? errorId : null].filter(Boolean).join(' ') || undefined
  const columnCount = columns ?? (options.length >= 3 ? 3 : 2)

  const isSelected = (value: string) => (props.type === 'radio' ? props.value === value : props.value.includes(value))

  const toggle = (value: string) => {
    if (props.type === 'radio') {
      props.onChange(value)
      return
    }
    const next = props.value.includes(value) ? props.value.filter((item) => item !== value) : [...props.value, value]
    props.onChange(next)
  }

  return (
    <fieldset
      className={`${styles.group} ${className}`.trim()}
      disabled={disabled}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      aria-required={props.type === 'radio' && required ? true : undefined}
      data-field-label={legend}
    >
      <legend className={styles.legend}>
        {legend}
        {required ? (
          <>
            <span className={styles.required} aria-hidden="true">
              *
            </span>
            <span className={styles.srOnly}> ({formCopy.requiredMark})</span>
          </>
        ) : null}
      </legend>
      {hint ? (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      ) : null}

      <div className={styles.listWrap} data-columns={columnCount}>
        <RevealGroup as="ul" className={styles.list} stagger={0.07} amount={0.15}>
          {options.map((option, index) => {
          const inputId = `${baseId}-${index}`
          const selected = isSelected(option.value)
          return (
            <RevealItem key={option.value} as="li" y={18} className={styles.item}>
              <label className={styles.card} htmlFor={inputId} data-selected={selected ? 'true' : undefined}>
                <input
                  id={inputId}
                  className={styles.input}
                  type={props.type}
                  name={name}
                  value={option.value}
                  checked={selected}
                  disabled={option.disabled}
                  required={props.type === 'radio' && required ? true : undefined}
                  onChange={() => toggle(option.value)}
                />
                {option.icon ? (
                  <span className={styles.icon} aria-hidden="true">
                    {option.icon}
                  </span>
                ) : null}
                <span className={styles.body}>
                  <span className={styles.label}>{option.label}</span>
                  {option.description ? <span className={styles.description}>{option.description}</span> : null}
                </span>
                <span className={styles.mark} data-shape={props.type} aria-hidden="true">
                  <svg viewBox="0 0 16 16" className={styles.markSvg} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" focusable="false">
                    <path className={styles.check} d="m3.5 8.4 2.9 2.9 6.1-6.3" pathLength="1" />
                  </svg>
                </span>
              </label>
            </RevealItem>
          )
          })}
        </RevealGroup>
      </div>

      {message ? (
        <p id={errorId} className={styles.error}>
          <FieldErrorIcon className={styles.errorIcon} />
          <span>{message}</span>
        </p>
      ) : null}
    </fieldset>
  )
}
