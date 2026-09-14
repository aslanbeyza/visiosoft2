import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../../components/Seo/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import styles from './Contact.module.css'

const locations = [
  {
    title: 'Depo',
    note: 'Araç ile 4. kata giriş yaparak ürün teslim alabilirsiniz.',
    address: 'A Blok Kat 4 No:277, Perpa Ticaret Merkezi, Halil Rıfat Paşa Mahallesi, No:2200, 34384 Şişli / İstanbul',
    map: 'https://www.google.com/maps/search/?api=1&query=Perpa%20Ticaret%20Merkezi%20A%20Blok%20Kat%204%20No%20277%2034384%20%C5%9Ei%C5%9Fli%20%C4%B0stanbul',
    tone: 'green',
  },
  {
    title: 'Showroom',
    note: '',
    address: 'Halil Rıfat Paşa Mahallesi, Darülaceze Caddesi, Perpa Ticaret Merkezi A Blok, Kat 8 No:1036, Şişli / İstanbul',
    map: 'https://www.google.com/maps/search/?api=1&query=Perpa%20Ticaret%20Merkezi%20A%20Blok%20Kat%208%20No%201036%20%C5%9Ei%C5%9Fli%20%C4%B0stanbul',
    tone: 'amber',
  },
  {
    title: 'Living LAB',
    note: '',
    address: 'Başak Mahallesi, Abdülhamithan Cd No:5, Başakşehir İnovasyon Merkezi, Başakşehir - İstanbul',
    map: 'https://www.google.com/maps/search/?api=1&query=Ba%C5%9Fak%C5%9Fehir%20%C4%B0novasyon%20Merkezi%20Abd%C3%BClhamithan%20Cd%20No%205',
    tone: 'sky',
  },
  {
    title: 'Teknopark',
    note: '',
    address: 'Yıldız Teknik Üniversitesi, İkitelli Teknopark 1B24, 34490 Başakşehir / İstanbul',
    map: 'https://www.google.com/maps/search/?api=1&query=Y%C4%B1ld%C4%B1z%20Teknik%20%C3%9Cniversitesi%20%C4%B0kitelli%20Teknopark%201B24',
    tone: 'violet',
  },
]

const facts = [
  ['Şirket Unvanı', 'VİSİOSOFT TEKNOLOJİ A.Ş.'],
  ['Vergi Dairesi', 'İKİTELLİ'],
  ['Vergi No', '9251021443'],
  ['Firma DUNS', '595600260'],
  ['MERSIS Numarası', '0925102144300001'],
  ['Ticaret Sicil No / Dosya No', '154166-5'],
  ['Kuruluş Tarihi', '07-09-2018'],
  ['Elektronik Tebligat Adresi', '25929-47072-05048'],
]

const logos = [
  ['iso-logo.webp', 'ISO 9001'],
  ['clipart-logo.webp', 'ISO 27001'],
  ['kvkk-logo.webp', 'KVKK'],
  ['soc-logo.webp', 'AICPA SOC'],
]

const greetings = ['Merhaba, nasılsınız?', 'Merhaba, Şimdi sizi dinliyorum.', 'Merhaba, sizin için burdayım.']

export default function Contact() {
  const { t, config } = useLocale()
  const path = usePath()
  const phone = config?.whatsapp_display || '+90 (501) 504 5034'
  const wa = config?.whatsapp_wa_id || '905015045034'
  const [hello, setHello] = useState(greetings[2])

  useEffect(() => {
    let index = 0
    const timer = window.setInterval(() => {
      index = (index + 1) % greetings.length
      setHello(greetings[index])
    }, 2800)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <>
      <Seo title={`${t('nav_contact')} - Visiosoft`} description={t('Visiosoft ile iletişime geçin. Depo, showroom, yazılım ofisi ve üretim lokasyonlarımız ile telefon ve e-posta bilgilerimiz.')} />
      <section className={styles.page}>
        <h1 className={styles.hello}>
          {t(hello)}
          <span className={styles.caret} />
        </h1>

        <div className={styles.contacts}>
          <a className={`${styles.tile} ${styles.wa}`} href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer">
            <p>{t('Satış & WhatsApp Hattı')}</p>
            <strong>{phone}</strong>
            <span>WhatsApp</span>
          </a>
          <a className={`${styles.tile} ${styles.phone}`} href="tel:+905303923468">
            <p>{t('Bayi Kanal Yöneticisi')}</p>
            <strong>Cihan Topaç</strong>
            <span>+90 530 392 34 68</span>
          </a>
          <a className={`${styles.tile} ${styles.mail}`} href="mailto:info@visiosoft.com.tr">
            <p>{t('Satış ve Destek')}</p>
            <strong>info@visiosoft.com.tr</strong>
            <span>{t('Mail Gönder')}</span>
          </a>
        </div>

        <h2>{t('Lokasyonlarımız')}</h2>
        <div className={styles.locations}>
          {locations.map((item) => (
            <article key={item.title} className={styles.location}>
              <span className={`${styles.pin} ${styles[item.tone]}`}>{item.title.slice(0, 1)}</span>
              <b>{t(item.title)}</b>
              <p>{item.address}</p>
              {item.note ? <small>{t(item.note)}</small> : null}
              <a href={item.map} target="_blank" rel="noreferrer">
                {t('Yol Tarifi Al')}
              </a>
            </article>
          ))}
        </div>

        <div className={styles.mapCard}>
          <div className={styles.chips}>
            {locations.map((item) => (
              <a key={item.title} href={item.map} target="_blank" rel="noreferrer">
                {t(item.title)}
              </a>
            ))}
          </div>
          <iframe
            title={t('Lokasyonlarımız')}
            src="https://www.openstreetmap.org/export/embed.html?bbox=28.78%2C41.05%2C28.99%2C41.11&layer=mapnik"
          />
        </div>

        <div className={styles.corporate}>
          <div className={styles.corpHead}>
            <h3>{t('Kurumsal')}</h3>
            <Link to={path('bank-accounts')}>{t('Banka Hesapları')} →</Link>
          </div>
          <div className={styles.facts}>
            {facts.map(([label, value]) => (
              <div key={label}>
                <span>{t(label)}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          <div className={styles.logos}>
            {logos.map(([file, label]) => (
              <div key={file}>
                <img src={`/footer-logo/${file}`} alt={label} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.meet}>
          <h2>{t('Online Görüşme Planlayın')}</h2>
          <p>{t('Uzmanımızla birebir görüşmek için uygun bir zaman seçin.')}</p>
          <iframe title="Calendly" src="https://calendly.com/fatihalp/30min?hide_gdpr_banner=1" />
        </div>
      </section>
    </>
  )
}
