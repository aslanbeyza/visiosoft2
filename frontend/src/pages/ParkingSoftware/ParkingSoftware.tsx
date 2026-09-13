import { useEffect } from 'react'
import Button from '../../components/Button/index.ts'
import Seo from '../../components/Seo/index.ts'
import { parkingSoftwareFaq } from '../../data/faqs/parking-software/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import styles from './ParkingSoftware.module.css'

const features = [
  { title: 'Araç Giriş-Çıkış', copy: 'Otomatik araç tespiti ve kayıt sistemi' },
  { title: 'Ödeme Entegrasyonu', copy: 'Tüm ödeme yöntemleri ile entegre çalışma' },
  { title: 'Abonelik Yönetimi', copy: 'Kapsamlı abonelik ve üyelik sistemi' },
  { title: 'Raporlama ve Analiz', copy: 'Detaylı gelir ve operasyon raporları' },
  { title: 'Güvenlik Kontrolü', copy: 'Kapsamlı güvenlik ve erişim kontrol sistemi' },
  { title: 'Anlık Bildirimler', copy: 'Önemli olaylar için otomatik bildirimler' },
]

const reasons = [
  { title: 'İnsansız Çalışma', copy: 'Tamamen otomatik, personel ihtiyacı minimum' },
  { title: 'Maliyet Tasarrufu', copy: "Operasyonel giderlerde %70'e varan tasarruf" },
  { title: 'Gelir Artışı', copy: 'Kaçak önleme ve verimli yönetimle gelir artışı' },
  { title: 'Müşteri Memnuniyeti', copy: 'Hızlı ve sorunsuz hizmetle yüksek memnuniyet' },
]

export default function ParkingSoftware() {
  const { t } = useLocale()
  const path = usePath()
  const faq = parkingSoftwareFaq()

  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.dataset.faqSchema = 'parking-software'
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.items
        .filter((item) => item.question && item.answer)
        .map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
    })
    document.head.appendChild(script)
    return () => script.remove()
  }, [faq.items])

  return (
    <>
      <Seo title={t('Otopark Yazılımı | Park Yönetim Sistemi | Visiosoft')} description={faq.meta_description} />

      <section className={styles.page}>
        <main className={styles.inner}>
          <section className={styles.hero}>
            <div>
              <h1>{t('Otopark Yazılımı')}</h1>
              <p>
                {t(
                  'Modern ve bulut tabanlı otopark yönetim yazılımı ile operasyonlarınızı dijitalleştirin. Tam otomatik, güvenilir ve kullanıcı dostu.',
                )}
              </p>
            </div>
            <div className={styles.heroImage}>
              <img src="/img/pages/kus_bakisi_otopark_yonetimi.webp" alt={t('Otopark Yazılımı')} />
              <span className={styles.liveChip}>
                <i />
                {t('Anlık Veri')}
              </span>
            </div>
          </section>

          <section className={styles.explainer}>
            <h2>{t('Otopark Yazılımı Nedir?')}</h2>
            <p>
              {t(
                'Otopark yazılımı, otopark işletmelerinin tüm operasyonlarını dijital ortamda yönetmesini sağlayan kapsamlı bir yönetim platformudur. Araç giriş-çıkış takibi, ücret hesaplama, ödeme alma, abonelik yönetimi ve raporlama gibi tüm süreçleri otomatikleştirir.',
              )}
            </p>
            <p>
              {t(
                'Visiosoft otopark yazılımı, bulut tabanlı mimarisi sayesinde her yerden erişilebilir, güvenli ve ölçeklenebilir bir çözüm sunar. Hem küçük otoparklar hem de büyük otopark zincirleri için ideal bir platformdur.',
              )}
            </p>
          </section>

          <section className={styles.features}>
            <h2>{t('Yazılım Özellikleri')}</h2>
            <div className={styles.featureGrid}>
              {features.map((item) => (
                <article key={item.title}>
                  <h3>{t(item.title)}</h3>
                  <p>{t(item.copy)}</p>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.why}>
            <h2>{t('Neden Visiosoft Yazılımı?')}</h2>
            <div className={styles.whyGrid}>
              {reasons.map((item) => (
                <article key={item.title}>
                  <h3>{t(item.title)}</h3>
                  <p>{t(item.copy)}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="otopark-yazilimi-sss" className={styles.faq}>
            <h2>{faq.section_title}</h2>
            <p className={styles.faqIntro}>{faq.section_intro}</p>
            <div className={styles.faqList}>
              {faq.items.map((item) => (
                <article key={item.question}>
                  <h3>
                    {faq.question_label} {item.question}
                  </h3>
                  <p>
                    {faq.answer_label} {item.answer}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.cta}>
            <h2>{t('Başlamaya Hazır mısınız?')}</h2>
            <p>{t('Demo için bizimle iletişime geçin ve sistemimizi ücretsiz deneyin.')}</p>
            <div className={styles.actions}>
              <Button to={path('quote.index')}>{t('Teklif Al')}</Button>
              <Button to={path('contact')} variant="ghost">
                {t('İletişim')}
              </Button>
            </div>
          </section>
        </main>
      </section>
    </>
  )
}
