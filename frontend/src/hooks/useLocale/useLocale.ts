import { useContext } from 'react'
import { LocaleContext } from '../../context/Locale/index.ts'

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLocale yalnızca LocaleProvider içinde kullanılabilir')
  }
  return context
}
