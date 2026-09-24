import { formCopy } from './formCopy.ts'
import type { FieldErrors } from './FormContext.ts'

type Control = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

export const HONEYPOT_NAME = 'website_url'

function isControl(element: Element): element is Control {
  return element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement
}

function fieldLabelOf(control: Control): string {
  return control.closest<HTMLElement>('[data-field-label]')?.dataset.fieldLabel?.trim() ?? ''
}

const TEXT_TYPES = new Set(['text', 'email', 'tel', 'url', 'search', 'password'])

function isBlankText(control: Control): boolean {
  if (!control.required || control instanceof HTMLSelectElement) return false
  if (control instanceof HTMLInputElement && !TEXT_TYPES.has(control.type)) return false
  return control.value.length > 0 && control.value.trim() === ''
}

function describeValidity(control: Control): string {
  const custom = control.dataset.errorMessage
  if (custom) return custom

  const { validity } = control
  if (validity.valueMissing || isBlankText(control)) {
    const label = fieldLabelOf(control)
    return label ? formCopy.requiredFieldError(label) : formCopy.requiredError
  }
  if (validity.typeMismatch) {
    if (control instanceof HTMLInputElement && control.type === 'email') return formCopy.emailError
    if (control instanceof HTMLInputElement && control.type === 'url') return formCopy.urlError
    return formCopy.invalidError
  }
  if (validity.tooShort && 'minLength' in control && control.minLength > 0) return formCopy.minLengthError(control.minLength)
  if (validity.tooLong && 'maxLength' in control && control.maxLength > 0) return formCopy.maxLengthError(control.maxLength)
  if (validity.rangeUnderflow || validity.rangeOverflow || validity.stepMismatch) return formCopy.rangeError
  if (validity.patternMismatch) return control.dataset.errorPattern ?? formCopy.invalidError
  return control.validationMessage || formCopy.invalidError
}

export function collectNativeErrors(form: HTMLFormElement): FieldErrors {
  const errors: FieldErrors = {}

  for (const element of Array.from(form.elements)) {
    if (!isControl(element)) continue
    const name = element.name
    if (!name || name === HONEYPOT_NAME || errors[name]) continue
    if (element instanceof HTMLInputElement && (element.type === 'hidden' || element.type === 'submit' || element.type === 'button')) continue
    if (!element.willValidate || (element.validity.valid && !isBlankText(element))) continue

    errors[name] = { id: element.id || undefined, message: describeValidity(element) }
  }

  return errors
}

export function controlIdFor(form: HTMLFormElement | null, name: string): string | undefined {
  if (!form) return undefined
  const item = form.elements.namedItem(name)
  if (item instanceof RadioNodeList) {
    const first = item.item(0)
    return first instanceof Element && first.id ? first.id : undefined
  }
  return item instanceof Element && item.id ? item.id : undefined
}

export function toFieldErrors(source: unknown, form: HTMLFormElement | null): FieldErrors {
  const errors: FieldErrors = {}
  if (!source || typeof source !== 'object') return errors

  for (const [name, raw] of Object.entries(source as Record<string, unknown>)) {
    const message = Array.isArray(raw) ? raw[0] : raw
    if (typeof message !== 'string' || !message) continue
    errors[name] = { id: controlIdFor(form, name), message }
  }

  return errors
}
