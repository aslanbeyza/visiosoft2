import type { ManualChapter } from './ManualChapters.tsx'
import type { ManualData } from './useFieldManual.ts'

export const chapterId = (index: number) => `bolum-${index + 1}`

export const OVERVIEW_ID = 'dokuman-kapsami'

export function toChapters(manual: ManualData): ManualChapter[] {
  return (manual.sections ?? []).map((section, index) => ({
    id: chapterId(index),
    title: section.title?.trim() || `Bölüm ${index + 1}`,
  }))
}
