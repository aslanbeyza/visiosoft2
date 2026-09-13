import { useEffect } from 'react'
import Button from '../../components/Button/index.ts'
import Seo from '../../components/Seo/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import styles from './WebsitePricing.module.css'

const price = { amount: '1499', label: '$1.499+', currency: 'USD' }

export default function WebsitePricing() {
  const { t } = useLocale()
  const path = usePath()

  const highlights = [
    {
      title: t('Bulut tabanlı erişim'),
      copy: t('Site yönetimi, güvenlik ekibi ve yetkili işletmeci panele internet olan her yerden erişebilir.'),
    },
    {
      title: t('Kat başına araç sınırı'),
      copy: t('Her kat, blok veya otopark alanı için ayrı araç limiti ve geçiş kuralı tanımlanabilir.'),
    },
    {
      title: t('Plaka ve abone yönetimi'),
      copy: t('Daire sakini, misafir, personel ve yetkili araç geçişleri tek panelden takip edilir.'),
    },
  ]

  const featureCards = [
    {
      title: t('Her yerden yönetim'),
      copy: t('Bulut tabanlı otopark yazılımı sayesinde site otoparkınızı ofisten, sahadan veya uzaktan güvenle yönetebilirsiniz.'),
      metric: price.label,
      tone: styles.blue,
    },
    {
      title: t('Kat bazlı kapasite'),
      copy: t('Kapalı otopark katları, bloklar ve açık otopark alanları için ayrı kapasite sınırları oluşturabilirsiniz.'),
      metric: t('Esnek limit'),
      tone: styles.green,
    },
    {
      title: t('Kontrollü geçiş'),
      copy: t('Plaka tanıma, abone tanımı ve misafir yetkilendirme ile site içi araç trafiği daha düzenli ilerler.'),
      metric: t('Düzenli erişim'),
      tone: styles.orange,
    },
  ]

  const steps = [
    {
      title: t('Otopark analizi'),
      copy: t('Giriş-çıkış noktaları, kat yapısı, bloklar, araç grupları ve yönetim ihtiyaçları netleştirilir.'),
    },
    {
      title: t('Kural planlama'),
      copy: t('Kat başına araç sınırı, abone/misafir geçişi, yetkili kullanıcı rolleri ve rapor ihtiyaçları belirlenir.'),
    },
    {
      title: t('Bulut panel kurulumu'),
      copy: t('Plaka listeleri, kapasite kuralları, geçiş senaryoları ve uzaktan erişim paneli devreye alınır.'),
    },
    {
      title: t('Test ve teslim'),
      copy: t('Geçiş senaryoları test edilir; site yönetimi ve güvenlik ekibine kullanım aktarılır.'),
    },
  ]

  const infoCards = [
    {
      title: t('Site otopark yönetim sistemi nedir?'),
      copy: t(
        'Site otopark yönetim sistemi; apartman, site ve rezidanslarda araç giriş-çıkışlarını, aboneleri, misafirleri ve kapasite kurallarını dijital olarak yönetmenizi sağlayan yazılım ve otomasyon altyapısıdır. Visiosoft bu süreci bulut tabanlı panel, plaka tanıma ve raporlama özellikleriyle tek ekranda toplar.',
      ),
    },
    {
      title: t('Neden bulut tabanlı otopark yönetimi?'),
      copy: t(
        'Bulut tabanlı yapı, otopark yönetimini güvenlik kulübesine veya tek bir bilgisayara bağlı bırakmaz. Yetkili kullanıcılar araç kayıtlarını, doluluk durumunu, kat bazlı limitleri ve raporları internet olan her yerden takip edebilir.',
      ),
    },
  ]

  const faqs = [
    {
      question: t('Site otoparklarında kat başına araç sınırı koyabilir miyiz?'),
      answer: t(
        'Evet. Visiosoft ile her kat, blok veya otopark alanı için ayrı araç limiti tanımlanabilir. Bu sayede doluluk, abone geçişi ve yetkilendirme kuralları daha düzenli yönetilir.',
      ),
    },
    {
      question: t('Sisteme site dışından erişilebilir mi?'),
      answer: t(
        'Evet. Bulut tabanlı mimari sayesinde yönetim paneline internet olan her yerden erişebilir; araç kayıtlarını, aboneleri, misafir geçişlerini ve raporları uzaktan takip edebilirsiniz.',
      ),
    },
    {
      question: t('Site otopark sistemi fiyatı nedir?'),
      answer: t(
        'Site otopark yönetim sistemi 1.499 dolardan başlayan fiyatlarla sunulur. Net fiyat; giriş-çıkış sayısı, kat yapısı, kamera/bariyer ihtiyacı ve entegrasyon kapsamına göre belirlenir.',
      ),
    },
  ]

  useEffect(() => {
    const service = document.createElement('script')
    service.type = 'application/ld+json'
    service.dataset.pricingSchema = 'service'
    service.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: t('Site Otoparkları İçin Bulut Tabanlı Otopark Yönetim Sistemi'),
      serviceType: t('Site otopark yönetim sistemi'),
      provider: { '@type': 'Organization', name: 'Visiosoft', url: window.location.origin },
      areaServed: 'TR',
      description: t(
        'Apartman, site ve rezidans otoparkları için bulut tabanlı otopark yönetimi; plaka tanıma, abone yönetimi, raporlama ve kat başına araç sınırı.',
      ),
      offers: {
        '@type': 'Offer',
        price: price.amount,
        priceCurrency: price.currency,
        availability: 'https://schema.org/InStock',
        url: window.location.href,
      },
    })

    const faqScript = document.createElement('script')
    faqScript.type = 'application/ld+json'
    faqScript.dataset.pricingSchema = 'faq'
    faqScript.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    })

    document.head.append(service, faqScript)
    return () => {
      service.remove()
      faqScript.remove()
    }
  }, [t])

  return (
    <>
      <Seo
        title={t('Site Otopark Yönetim Sistemi | Bulut Tabanlı Çözüm - Visiosoft')}
        description={t(
          'Site otoparkları için bulut tabanlı otopark yönetim sistemi. Her yerden erişim, kat başına araç sınırı, plaka tanıma, abone ve misafir yönetimiyle 1.499 dolardan başlayan fiyatlar.',
        )}
      />

      <section className={styles.page}>
        <div className={styles.inner}>
          <header className={styles.hero}>
            <div>
              <span className={styles.eyebrow}>{t('Site Otoparkları')}</span>
              <h1>{t('Site otopark yönetimi için bulut tabanlı sistem.')}</h1>
              <p>
                {t(
                  'Visiosoft; apartman, site ve rezidans otoparklarında araç giriş-çıkışlarını tek panelden yönetmenizi sağlar. Her yerden erişilebilen bulut altyapısı ile kat başına araç sınırı, plaka tanıma, abone ve misafir yönetimi daha düzenli hale gelir.',
                )}
              </p>
              <div className={styles.heroActions}>
                <Button to={path('quote.index')}>{t('Teklif Al')}</Button>
                <a href="#features" className={styles.secondary}>
                  {t('Özellikleri İncele')}
                </a>
              </div>
            </div>

            <div className={styles.priceGlow}>
              <div className={styles.screen}>
                <div className={styles.dots} aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <div className={styles.priceCard}>
                  <div className={styles.priceHead}>
                    <div>
                      <span>{t('Başlangıç')}</span>
                      <strong>{price.label}</strong>
                    </div>
                  </div>
                  <div className={styles.highlights}>
                    {highlights.map((item) => (
                      <article key={item.title}>
                        <strong>{item.title}</strong>
                        <p>{item.copy}</p>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </header>

          <section id="features" className={styles.section}>
            <span className={styles.label}>{t('Site otopark çözümü')}</span>
            <h2>{t('Site sakinleri, güvenlik ekibi ve yönetim için daha düzenli otopark akışı.')}</h2>
            <p>
              {t(
                'Site otopark yönetim sistemi 1.499 dolardan başlayan fiyatlarla sunulur. Giriş-çıkış sayısı, kat yapısı, kamera/bariyer ihtiyacı ve entegrasyon kapsamı birlikte değerlendirilerek net proje kapsamı belirlenir.',
              )}
            </p>
            <div className={styles.featureGrid}>
              {featureCards.map((item) => (
                <article key={item.title}>
                  <i className={item.tone} />
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                  <strong>{item.metric}</strong>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.onboarding}>
            <div>
              <span className={styles.label}>{t('Kurulum süreci')}</span>
              <h2>{t('Mevcut otopark düzenini bozmadan dijital yönetime geçin.')}</h2>
              <p>
                {t(
                  'Önce otoparkın kat yapısını, giriş-çıkış noktalarını ve kullanıcı tiplerini analiz ederiz. Ardından bulut panel, plaka tanıma, bariyer ve yetkilendirme kurallarını site yapınıza uygun şekilde devreye alırız.',
                )}
              </p>
            </div>
            <ol>
              {steps.map((step, index) => (
                <li key={step.title}>
                  <span>{index + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.copy}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className={styles.infoGrid}>
            {infoCards.map((card) => (
              <article key={card.title}>
                <h2>{card.title}</h2>
                <p>{card.copy}</p>
              </article>
            ))}
          </section>

          <section className={styles.section}>
            <span className={styles.label}>{t('Sık sorulan sorular')}</span>
            <h2>{t('Site otopark sistemi hakkında merak edilenler.')}</h2>
            <div className={styles.faqList}>
              {faqs.map((faq) => (
                <article key={faq.question}>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.bottomCta}>
            <span className={styles.label}>{t('Hazır mısınız?')}</span>
            <h2>{t('Site otoparkınızı buluttan yönetmeye başlayın.')}</h2>
            <p>
              {t(
                '1.499 dolardan başlayan fiyatlarla; kat yapısını, araç limitlerini, geçiş senaryolarını ve teknik ihtiyaçları birlikte netleştirelim.',
              )}
            </p>
            <Button to={path('quote.index')}>{t('Teklif Al')}</Button>
          </section>
        </div>
      </section>
    </>
  )
}
