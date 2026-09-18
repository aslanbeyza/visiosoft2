const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

type Json = Record<string, unknown>

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
    ...init,
  })

  const data = (await response.json().catch(() => ({}))) as T & { message?: string; errors?: Json }

  if (!response.ok) {
    const error = new Error(data.message || 'İstek başarısız') as Error & { status?: number; errors?: Json }
    error.status = response.status
    error.errors = data.errors
    throw error
  }

  return data
}

export function getHealth() {
  return request<{ status: string }>('/health')
}

export function getWebsiteConfig() {
  return request<{
    data: {
      locales: string[]
      meet_url: string
      calendly_url: string
      whatsapp_wa_id: string
      whatsapp_display: string
      turnstile_site_key: string
      payment_iframe: string
    }
  }>('/api/website/config')
}

export function getBlogIndex() {
  return request<{ data: BlogPost[] }>('/api/blog')
}

export function getBlogPost(slug: string) {
  return request<{ data: BlogPost & { content: string; related: BlogPost[] } }>(`/api/blog/${slug}`)
}

export function getFieldManual() {
  return request<{ data: { title?: string; sections?: ManualSection[]; pdf_filename?: string } }>(
    '/api/manuals/field-user-manual',
  )
}

export function submitLead(kind: 'quote' | 'parking-quote-engine' | 'discovery' | 'contact', body: Json) {
  return request<{ message: string }>(`/api/leads/${kind}`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export type BlogPost = {
  title: string
  slug: string
  excerpt?: string
  formatted_date?: string
  featured_image?: string | null
  reading_minutes?: number
}

export type ManualSection = {
  title?: string
  body?: string
  items?: string[]
}

export { API_URL }
