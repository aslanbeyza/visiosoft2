import { useCallback, useEffect, useState } from 'react'
import { getBlogIndex } from '../../services/index.ts'
import type { BlogPost } from '../../services/index.ts'

export type BlogIndexState = { status: 'loading' } | { status: 'error' } | { status: 'ready'; posts: BlogPost[] }

type Result = { attempt: number; posts: BlogPost[] | null }

/**
 * Blog listesini getirir. Yükleniyor durumu, sonucun ait olduğu deneme numarasından türetilir;
 * efekt içinde eşzamanlı setState yapılmaz. `retry` yeni bir deneme başlatır.
 */
export function useBlogIndex() {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<Result | null>(null)

  useEffect(() => {
    let cancelled = false
    getBlogIndex()
      .then((response) => {
        if (!cancelled) setResult({ attempt, posts: Array.isArray(response.data) ? response.data : [] })
      })
      .catch(() => {
        if (!cancelled) setResult({ attempt, posts: null })
      })
    return () => {
      cancelled = true
    }
  }, [attempt])

  const retry = useCallback(() => setAttempt((value) => value + 1), [])

  let state: BlogIndexState = { status: 'loading' }
  if (result && result.attempt === attempt) {
    state = result.posts ? { status: 'ready', posts: result.posts } : { status: 'error' }
  }

  return { state, retry }
}
