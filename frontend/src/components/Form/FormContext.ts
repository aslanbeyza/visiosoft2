import { createContext, useContext } from 'react'

export type FormStatus = 'idle' | 'sending' | 'success' | 'error'

/** Alan adına göre hata kaydı; `id` hata özetindeki bağlantının hedefidir. */
export type FieldErrorEntry = { id?: string; message: string }
export type FieldErrors = Record<string, FieldErrorEntry>

export type FormKitContextValue = {
  status: FormStatus
  errors: FieldErrors
}

/** Form dışında da çalışır: boş hata listesi ve idle durumu döner. */
export const FormKitContext = createContext<FormKitContextValue>({ status: 'idle', errors: {} })

export function useFormKit(): FormKitContextValue {
  return useContext(FormKitContext)
}

/** Form'un doğrulama/sunucu hatalarından verilen alan adına düşeni döndürür. */
export function useFieldError(name?: string): string | undefined {
  const { errors } = useContext(FormKitContext)
  return name ? errors[name]?.message : undefined
}
