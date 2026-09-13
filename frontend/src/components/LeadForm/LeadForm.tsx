import { useState } from 'react'
import type { FormEvent } from 'react'
import { submitLead } from '../../services/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import Button from '../Button/index.ts'
import styles from './LeadForm.module.css'

type LeadKind = 'quote' | 'parking-quote-engine' | 'discovery'

type LeadFormProps = {
  kind: LeadKind
  extraFields?: 'address' | 'parking'
}

export default function LeadForm({ kind, extraFields }: LeadFormProps) {
  const { t, config } = useLocale()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const body: Record<string, unknown> = {
      name: String(form.get('name') || ''),
      email: String(form.get('email') || ''),
      phone: String(form.get('phone') || ''),
      company: String(form.get('company') || ''),
      message: String(form.get('message') || ''),
      website_url: String(form.get('website_url') || ''),
      'cf-turnstile-response': String(form.get('cf-turnstile-response') || 'local-dev'),
    }

    if (extraFields === 'address') {
      body.address = String(form.get('address') || '')
    }

    if (extraFields === 'parking') {
      body.project_type = String(form.get('project_type') || 'paid')
      body.needs_barrier = form.get('needs_barrier') === 'on'
      body.needs_turnkey_installation = form.get('needs_turnkey_installation') === 'on'
      body.payment_methods = form.getAll('payment_methods')
      body.products = [
        { id: 'anpr', name: t('Plaka Tanıma Sistemi (PTS)'), qty: 1, isFree: false },
      ]
    }

    setLoading(true)
    setError('')
    setMessage('')

    try {
      const result = await submitLead(kind, body)
      setMessage(result.message)
      event.currentTarget.reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : t('Bir hata oluştu. Lütfen tekrar deneyin.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.grid}>
        <label>
          {t('Ad Soyad')}
          <input name="name" required />
        </label>
        <label>
          {t('Telefon')}
          <input name="phone" required />
        </label>
        <label>
          {t('E-posta')}
          <input name="email" type="email" required />
        </label>
        <label>
          {t('Şirket Adı (Opsiyonel)')}
          <input name="company" />
        </label>
      </div>

      {extraFields === 'address' ? (
        <label>
          {t('Adres')}
          <textarea name="address" rows={3} required placeholder={t('discovery_note_placeholder')} />
        </label>
      ) : null}

      {extraFields === 'parking' ? (
        <div className={styles.extra}>
          <label>
            {t('Proje tipi')}
            <select name="project_type" defaultValue="paid">
              <option value="paid">{t('Ücretli otopark')}</option>
              <option value="subscription">{t('Sadece abonelik')}</option>
            </select>
          </label>
          <label className={styles.check}>
            <input type="checkbox" name="needs_barrier" /> {t('Bariyer')}
          </label>
          <label className={styles.check}>
            <input type="checkbox" name="needs_turnkey_installation" /> {t('Anahtar teslim kurulum')}
          </label>
          <label className={styles.check}>
            <input type="checkbox" name="payment_methods" value="card" defaultChecked /> {t('Kart')}
          </label>
          <label className={styles.check}>
            <input type="checkbox" name="payment_methods" value="hgs" /> {t('HGS')}
          </label>
        </div>
      ) : null}

      <label>
        {t('Ek Mesaj (Opsiyonel)')}
        <textarea name="message" rows={3} />
      </label>

      <div className={styles.honeypot}>
        <label htmlFor="website_url">Website</label>
        <input id="website_url" name="website_url" autoComplete="off" />
      </div>

      {config?.turnstile_site_key ? (
        <div className="cf-turnstile" data-sitekey={config.turnstile_site_key} />
      ) : null}

      {error ? <p className={styles.error}>{error}</p> : null}
      {message ? <p className={styles.ok}>{message}</p> : null}

      <Button type="submit" disabled={loading}>
        {loading ? '...' : t('Teklif İste')}
      </Button>
    </form>
  )
}
