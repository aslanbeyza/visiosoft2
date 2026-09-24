import { useCallback, useEffect, useState } from 'react'
import { getBlogPost } from '../../services/index.ts'
import type { BlogPost } from '../../services/index.ts'

export type BlogPostDetail = BlogPost & { content: string; related: BlogPost[] }

export type BlogPostState =
  | { status: 'loading' }
  | { status: 'missing' }
  | { status: 'error' }
  | { status: 'ready'; post: BlogPostDetail }

type Result = { key: string; post: BlogPostDetail | null; missing: boolean }

export function useBlogPost(slug: string) {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<Result | null>(null)
  const key = `${slug}#${attempt}`

  useEffect(() => {
    if (!slug) return undefined
    let cancelled = false
    getBlogPost(slug)
      .then((response) => {
        if (!cancelled) setResult({ key, post: response.data ?? null, missing: !response.data })
      })
      .catch((error: unknown) => {
        const status = (error as { status?: number }).status
        if (!cancelled) setResult({ key, post: null, missing: status === 404 })
      })
    return () => {
      cancelled = true
    }
  }, [key, slug])

  const retry = useCallback(() => setAttempt((value) => value + 1), [])

  let state: BlogPostState = { status: 'loading' }
  if (!slug) state = { status: 'missing' }
  else if (result && result.key === key) {
    if (result.post) state = { status: 'ready', post: result.post }
    else state = result.missing ? { status: 'missing' } : { status: 'error' }
  }

  return { state, retry }
}
