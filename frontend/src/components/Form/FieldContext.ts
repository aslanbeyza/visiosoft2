import { createContext, useContext, useId } from 'react'

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
