import { LOCAL_TURNSTILE_TOKEN } from '../../hooks/useTurnstile/index.ts'
import { leadFormCopy } from './leadFormCopy.ts'

export type LeadKind = 'quote' | 'parking-quote-engine' | 'discovery' | 'contact'
export type LeadExtraFields = 'address' | 'parking'

const text = (data: FormData, key: string) => String(data.get(key) || '')

export function buildLeadBody(data: FormData, extraFields?: LeadExtraFields, token?: string) {
  const body: Record<string, unknown> = {
    name: text(data, 'name'),
    email: text(data, 'email'),
    phone: text(data, 'phone'),
    company: text(data, 'company'),
    message: text(data, 'message'),
    website_url: text(data, 'website_url'),
    'cf-turnstile-response': text(data, 'cf-turnstile-response') || token || LOCAL_TURNSTILE_TOKEN,
  }

  if (extraFields === 'address') {
    body.address = text(data, 'address')
  }

  if (extraFields === 'parking') {
    body.project_type = text(data, 'project_type') || 'paid'
    body.needs_barrier = data.get('needs_barrier') === 'on'
    body.needs_turnkey_installation = data.get('needs_turnkey_installation') === 'on'
    body.payment_methods = data.getAll('payment_methods')
    body.products = [{ id: 'anpr', name: leadFormCopy.parking.product, qty: 1, isFree: false }]
  }

  return body
}
