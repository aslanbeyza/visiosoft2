import { useState } from 'react'
import Seo from '../../components/Seo/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import styles from './BankAccounts.module.css'

const banks = [
  {
    code: 'TEB',
    tone: 'green',
    name: 'Türkiye Ekonomi Bankası',
    company: 'VİSİOSOFT TEKNOLOJİ AŞ',
    fields: [
      { labelKey: 'TL IBAN', display: 'TR75 0003 2000 0000 0063 1568 23', value: 'TR750003200000000063156823' },
      { labelKey: 'USD IBAN', display: 'TR64 0003 2000 0000 0063 1568 27', value: 'TR640003200000000063156827' },
    ],
    extras: [
      { labelKey: 'Şube', value: '32 - MERTER' },
      { labelKey: 'Hesap No', value: '63156823' },
    ],
  },
  {
    code: 'KT',
    tone: 'yellow',
    name: 'Kuveyt Türk',
    company: 'VİSİOSOFT TEKNOLOJİ AŞ',
    fields: [
      { labelKey: 'TL IBAN', display: 'TR02 0020 5000 0961 1910 1000 01', value: 'TR020020500009611910100001' },
      { labelKey: 'EURO IBAN', display: 'TR88 0020 5000 0961 1910 1001 02', value: 'TR880020500009611910100102' },
      { labelKey: 'USD IBAN', display: 'TR18 0020 5000 0961 1910 1001 01', value: 'TR180020500009611910100101' },
    ],
    extras: [{ labelKey: 'SWIFT Code', value: 'KTEFTRISXXX' }],
  },
]

export default function BankAccounts() {
  const { t } = useLocale()
  const [copied, setCopied] = useState('')

  async function copyValue(value: string) {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(value)
      window.setTimeout(() => setCopied(''), 1600)
    } catch {
      setCopied('')
    }
  }

  return (
    <>
      <Seo title={t('Banka Hesapları - Visiosoft')} description={t('Visiosoft Teknoloji A.Ş. banka hesap bilgileri.')} />
      <section className={styles.page}>
        <div className={styles.hero}>
          <h1>{t('Banka Hesaplarımız')}</h1>
          <p>{t('Ödemeleriniz için aşağıdaki banka hesaplarımızı kullanabilirsiniz.')}</p>
        </div>
        <div className={styles.grid}>
          {banks.map((bank) => (
            <article key={bank.code} className={styles.card}>
              <div className={styles.head}>
                <div className={`${styles.badge} ${styles[bank.tone]}`}>{bank.code}</div>
                <div>
                  <h2>{bank.name}</h2>
                  <p>{bank.company}</p>
                </div>
              </div>
              {bank.fields.map((field) => (
                <button key={field.value} type="button" className={styles.iban} onClick={() => copyValue(field.value)}>
                  <span>{t(field.labelKey)}</span>
                  <code>{field.display}</code>
                  <em>{copied === field.value ? '✓' : ''}</em>
                </button>
              ))}
              <div className={styles.extras}>
                {bank.extras.map((extra) => (
                  <div key={extra.labelKey}>
                    <span>{t(extra.labelKey)}</span>
                    <strong>{extra.value}</strong>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
        <p className={styles.hint}>{t('* IBAN numaralarını kopyalamak için üzerine tıklayabilirsiniz.')}</p>
      </section>
    </>
  )
}
