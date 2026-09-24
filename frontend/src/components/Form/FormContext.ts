import { createContext, useContext } from 'react'

export type FormStatus = 'idle' | 'sending' | 'success' | 'error'

export type FieldErrorEntry = { id?: string; message: string }
export type FieldErrors = Record<string, FieldErrorEntry>

export type FormKitContextValue = {
  status: FormStatus
  errors: FieldErrors
}

export const FormKitContext = createContext<FormKitContextValue>({ status: 'idle', errors: {} })

export function useFormKit(): FormKitContextValue {
  return useContext(FormKitContext)
}

export function useFieldError(name?: string): string | undefined {
  const { errors } = useContext(FormKitContext)
  return name ? errors[name]?.message : undefined
}
