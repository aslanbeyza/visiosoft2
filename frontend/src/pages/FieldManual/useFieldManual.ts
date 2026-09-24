import { useCallback, useEffect, useState } from 'react'
import { getFieldManual } from '../../services/index.ts'

export type ManualSpec = { label: string; value: string }

export type ManualSectionData = {
  title?: string
  summary?: string
  body?: string
  paragraphs?: string[]
  items?: string[]
  specs?: ManualSpec[]
}

export type ManualData = {
  title?: string
  subtitle?: string
  document_type?: string
  version_label?: string
  version?: string
  publish_date_label?: string
  publish_date?: string
  download_pdf_button?: string
  print_button?: string
  toc_title?: string
  overview_title?: string
  overview?: string
  specs_key_label?: string
  specs_value_label?: string
  empty_section_message?: string
  footer_note?: string
  pdf_filename?: string
  sections?: ManualSectionData[]
}

export type FieldManualState = { status: 'loading' } | { status: 'error' } | { status: 'ready'; manual: ManualData }

type Result = { attempt: number; manual: ManualData | null }

export function useFieldManual() {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<Result | null>(null)

  useEffect(() => {
    let cancelled = false
    getFieldManual()
      .then((response) => {
        const manual: ManualData = response.data ?? {}
        if (!cancelled) setResult({ attempt, manual })
      })
      .catch(() => {
        if (!cancelled) setResult({ attempt, manual: null })
      })
    return () => {
      cancelled = true
    }
  }, [attempt])

  const retry = useCallback(() => setAttempt((value) => value + 1), [])

  let state: FieldManualState = { status: 'loading' }
  if (result && result.attempt === attempt) {
    state = result.manual ? { status: 'ready', manual: result.manual } : { status: 'error' }
  }

  return { state, retry }
}
