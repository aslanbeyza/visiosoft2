import { createContext, useContext, useId } from 'react'

/** Field'ın içine yerleştirilen kontrolün otomatik aldığı bağlam. */
export type FieldControlContextValue = {
  id: string
  describedBy?: string
  invalid: boolean
  required: boolean
  name?: string
}

export const FieldContext = createContext<FieldControlContextValue | null>(null)

type OwnControlProps = {
  id?: string
  describedBy?: string
  invalid?: boolean
  required?: boolean
}

/**
 * Kontrolün kendi prop'ları önceliklidir; verilmeyenler en yakın Field'dan gelir.
 * Field dışında kullanıldığında kimlik useId ile üretilir.
 */
export function useFieldControl(own: OwnControlProps) {
  const context = useContext(FieldContext)
  const fallbackId = useId()

  return {
    id: own.id ?? context?.id ?? fallbackId,
    describedBy: own.describedBy ?? context?.describedBy,
    invalid: own.invalid ?? context?.invalid ?? false,
    required: own.required ?? context?.required ?? false,
  }
}
