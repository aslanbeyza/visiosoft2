import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../../components/Seo/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import styles from './ParkingReports.module.css'

export default function ParkingReports() {
  const { t, config } = useLocale()
  const path = usePath()
  const [active, setActive] = useState('operasyonel')
  const [visible, setVisible] = useState<Record<string, boolean>>({})

  const groups = [
    {
      anchor: 'operasyonel',
      label: t('Operasyonel Raporlar'),
      headline: t('Saha trafiğini net ve hızlı takip edin.'),
      summary: t('Giriş-çıkış, doluluk ve geçiş verilerini tek ekranda görün.'),
      items: [
        {
          title: t('Günlük / Aylık / Tarih Aralıklı Giriş-Çıkış Raporu'),
          description: t('Seçtiğiniz dönem için giriş-çıkış adetlerini gösterir.'),
        },
        {
          title: t('Anlık Otopark Doluluk Raporu'),
          description: t('Anlık dolu, boş ve toplam kapasite bilgisini sunar.'),
        },
        {
          title: t('Saatlik Yoğunluk Analizi'),
          description: t('Saat bazında yoğun saatleri net şekilde çıkarır.'),
        },
        {
          title: t('Kapı / Bariyer Bazlı Geçiş Raporu'),
          description: t('Kapı ve bariyer bazında geçiş sayılarını listeler.'),
        },
        {
          title: t('Kamera Bazlı Geçiş Kayıtları'),
          description: t('Kamera tespit kayıtlarını zaman bilgisiyle gösterir.'),
        },
        {
          title: t('Beyaz Liste / Kara Liste Geçiş Raporu'),
          description: t('Beyaz ve kara liste geçişlerini ayrı raporlar.'),
        },
        {
          title: t('HGS İşlem Raporu'),
          description: t('HGS işlemlerini ve hatalı kayıtları raporlar.'),
        },
      ],
    },
    {
      anchor: 'finansal',
      label: t('Finansal Raporlar'),
      headline: t('Gelir ve tahsilatı sade raporlarla izleyin.'),
      summary: t('Ciro, ödeme tipleri ve iadeleri kolayca kontrol edin.'),
      items: [
        { title: t('Günlük Ciro Raporu'), description: t('Günlük toplam cironuzu özetler.') },
        {
          title: t('Tarih Aralıklı Gelir Raporu'),
          description: t('Seçilen dönem için toplam geliri gösterir.'),
        },
        {
          title: t('Ödeme Yöntemine Göre Tahsilat Raporu (HGS / POS / Nakit vb.)'),
          description: t('Tahsilatları ödeme türüne göre ayırır.'),
        },
        {
          title: t('Ücretlendirme Tarifesi Bazlı Gelir Raporu'),
          description: t('Tarife bazında gelir dağılımını sunar.'),
        },
        {
          title: t('Abonelik Gelir Raporu'),
          description: t('Abonelik gelirlerini dönemsel olarak gösterir.'),
        },
        {
          title: t('İade Raporu'),
          description: t('İade işlemlerini tutar ve zaman bilgisiyle listeler.'),
        },
        { title: t('Borç / Alacak Raporu'), description: t('Borç ve alacak durumunu özetler.') },
      ],
    },
    {
      anchor: 'abonelik',
      label: t('Abonelik ve Müşteri Raporları'),
      headline: t('Aboneleri ve paketleri tek yerden yönetin.'),
      summary: t('Durum, kullanım ve satış eğilimlerini kolayca izleyin.'),
      items: [
        {
          title: t('Aktif / Pasif Abonelik Listesi'),
          description: t('Aktif, pasif ve süresi dolan aboneleri listeler.'),
        },
        {
          title: t('Abonelik Başlangıç-Bitiş Raporu'),
          description: t('Abonelik başlangıç ve bitiş tarihlerini gösterir.'),
        },
        {
          title: t('Abone Kullanım Raporu'),
          description: t('Abonelerin kullanım sıklığını ve alışkanlıklarını raporlar.'),
        },
        {
          title: t('Paket Satış Raporu'),
          description: t('Paket satış adet ve gelirini gösterir.'),
        },
      ],
    },
  ]

  const highlights = [
    t('Anlık Akış'),
    t('Esnek Filtre'),
    t('Tek Tık Dışa Aktarım'),
    t('Yeni Raporlara Açık'),
  ]

  const faqs = [
    {
      question: t('Standart raporlar dışında farklı bir rapor talebim olması durumunda ek bir ücret yansıtılıyor mu?'),
      answer: t(
        'Mümkün olan rapor talepleri ücretsiz hazırlanabilir. Sadece size özel geliştirme gerektiren raporlar veya özellikler ayrıca ücretlendirilir.',
      ),
    },
  ]

  const wa = config?.whatsapp_wa_id || '905015045034'
  const whatsappUrl = `https://wa.me/${wa}?text=${encodeURIComponent(
    t('Merhaba, otopark raporlama modülü hakkında bilgi almak istiyorum.'),
  )}`

  useEffect(() => {
    const ids = [...groups.map((group) => group.anchor), 'yeni-raporlar', 'sss']
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node))

    if (!('IntersectionObserver' in window)) {
      setVisible(Object.fromEntries(ids.map((id) => [id, true])))
      return
    }

    const reveal = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible((current) => ({ ...current, [entry.target.id]: true }))
          }
        })
      },
      { threshold: 0.18, rootMargin: '0px 0px -10% 0px' },
    )

    const spy = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting)
        if (!visibleEntries.length) return
        visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        setActive(visibleEntries[0].target.id)
      },
      { threshold: [0.25, 0.5, 0.75], rootMargin: '-20% 0px -45% 0px' },
    )

    nodes.forEach((node) => {
      reveal.observe(node)
      spy.observe(node)
    })

    return () => {
      reveal.disconnect()
      spy.disconnect()
    }
  }, [t])

  const navItems = [...groups.map((group) => ({ id: group.anchor, label: group.label })), { id: 'yeni-raporlar', label: t('Yeni Rapor Ekleme') }]

  return (
    <>
      <Seo
        title={t('Otopark Yazılımında Raporlar | Visiosoft')}
        description={t(
          'Visiosoft otopark yazılımı; operasyonel, finansal ve abonelik raporlarını tek panelde sunar. Her rapor tipi detaylı analiz ve yeni rapor ekleme esnekliği sağlar.',
        )}
      />

      <section className={styles.page}>
        <div className={styles.inner}>
          <header className={styles.hero}>
            <p className={styles.eyebrow}>{t('Raporlama Mimarisi')}</p>
            <h1>{t('Otopark Yazılımında Raporlar')}</h1>
            <p>{t('Operasyon, finans ve abonelik verilerini tek panelde sade ve hızlı şekilde sunar.')}</p>
            <div className={styles.orb} aria-hidden="true">
              <div>{t('Akıllı Raporlama Katmanı')}</div>
            </div>
            <div className={styles.chips}>
              {highlights.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </header>

          <nav className={styles.nav} aria-label={t('Rapor kategorileri')}>
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={active === item.id ? styles.active : undefined}
                onClick={() => setActive(item.id)}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {groups.map((group) => (
            <section
              key={group.anchor}
              id={group.anchor}
              className={`${styles.group} ${visible[group.anchor] ? styles.visible : ''}`}
            >
              <header>
                <p>{group.label}</p>
                <h2>{group.headline}</h2>
                <p>{group.summary}</p>
              </header>
              <div className={styles.grid}>
                {group.items.map((item) => (
                  <article key={item.title}>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </article>
                ))}
              </div>
            </section>
          ))}

          <section id="yeni-raporlar" className={`${styles.future} ${visible['yeni-raporlar'] ? styles.visible : ''}`}>
            <h2>{t('Yeni rapor eklemek kolaydır.')}</h2>
            <p>{t('Sistem modülerdir. Yeni raporlar, filtreler ve çıktı formatları (Excel/PDF) hızlıca eklenebilir.')}</p>
            <div className={styles.futureGrid}>
              <article>
                <h3>{t('Modüler Rapor Şablonları')}</h3>
                <p>{t('Yeni raporlar mevcut yapıya hızlıca eklenir.')}</p>
              </article>
              <article>
                <h3>{t('Esnek Filtreleme')}</h3>
                <p>{t('Tarih, kapı, bariyer ve ödeme tipi filtreleri kolayca tanımlanır.')}</p>
              </article>
              <article>
                <h3>{t('Ölçeklenebilir Veri Yapısı')}</h3>
                <p>{t('Artan veri hacminde performansını korur.')}</p>
              </article>
            </div>
          </section>

          <section id="sss" className={styles.faq}>
            <p>{t('FAQ')}</p>
            <h2>{t('Sık Sorulan Sorular')}</h2>
            <div>
              {faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className={styles.cta}>
            <h2>{t('Raporları canlı ortamda görmek ister misiniz?')}</h2>
            <p>{t('Demo’da tüm raporları gerçek senaryolarla birlikte hızlıca inceleyebilirsiniz.')}</p>
            <div className={styles.actions}>
              <Link to={path('quote.index')} className={styles.primary}>
                {t('Teklif Al')}
              </Link>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.secondary}>
                {t('WhatsApp ile Ulaş')}
              </a>
            </div>
          </section>
        </div>
      </section>
    </>
  )
}
