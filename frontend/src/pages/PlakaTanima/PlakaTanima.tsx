import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/Button/index.ts'
import Seo from '../../components/Seo/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import styles from './PlakaTanima.module.css'

const sections = [
  { id: 'success', label: 'Başarı', icon: 'chart' },
  { id: 'data', label: 'Eğitim', icon: 'db' },
  { id: 'speed', label: 'Hız', icon: 'bolt' },
  { id: 'tech', label: 'Teknoloji', icon: 'chip' },
] as const

function Icon({ name }: { name: string }) {
  if (name === 'chart') {
    return (
      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M4 19V5M4 19h16M8 15v4M12 11v8M16 7v12" />
      </svg>
    )
  }
  if (name === 'db') {
    return (
      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <ellipse cx="12" cy="6" rx="7" ry="3" />
        <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
      </svg>
    )
  }
  if (name === 'chip') {
    return (
      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="7" y="7" width="10" height="10" rx="1" />
        <path d="M9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4" />
      </svg>
    )
  }
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13 3 4 14h7l-1 7 9-11h-7l1-7z" />
    </svg>
  )
}

export default function PlakaTanima() {
  const { t } = useLocale()
  const path = usePath()
  const [active, setActive] = useState('success')

  useEffect(() => {
    const onScroll = () => {
      let current = 'success'
      for (const section of sections) {
        const el = document.getElementById(section.id)
        if (el && window.scrollY >= el.offsetTop - 200) current = section.id
      }
      setActive(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <Seo
        title={t('Plaka Tanıma Sistemi | %99.9 Başarı | Visiosoft')}
        description={t('6.5 Milyon gerçek fotoğrafla eğitilmiş yapay zeka. En zorlu koşullarda bile %99 gerçek saha başarısı.')}
      />

      <div className={styles.backdrop} aria-hidden="true">
        <div className={`${styles.blob} ${styles.blobA}`} />
        <div className={`${styles.blob} ${styles.blobB}`} />
      </div>

      <main className={styles.page}>
        <section className={styles.hero}>
          <h1>
            <span>{t('Kusursuz Tanıma.')}</span>
          </h1>
          <p className={styles.lead}>{t('Zorlu koşullarda bile %99 başarı oranı.')}</p>

          <div className={styles.plateWrap} aria-hidden="true">
            <div className={styles.dots} />
            <div className={styles.plate}>
              <div className={styles.eu} />
              <span>34 VS 1923</span>
            </div>
            <div className={styles.scan} />
            <div className={styles.target}>
              <div className={styles.box} />
              <div className={styles.badge}>%99.9 CLEAN</div>
            </div>
          </div>

          <p className={styles.note}>
            {t('Yapay zeka modelimiz, Türkiye ve dünya genelinden toplanan 6.500.000+ gerçek saha fotoğrafıyla eğitildi.')}
          </p>

          <div className={styles.actions}>
            <Button to={path('quote.index')}>{t('Teklif Al')}</Button>
            <Button to={path('discovery.show')} variant="ghost">
              {t('Ücretsiz Keşif İste')}
            </Button>
          </div>

          <div className={styles.chevron} aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </section>

        <nav className={styles.nav} aria-label={t('Başarı')}>
          <div className={styles.navInner}>
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={active === section.id ? styles.active : undefined}
              >
                <Icon name={section.icon} />
                <span>{t(section.label)}</span>
              </a>
            ))}
          </div>
        </nav>

        <section className={styles.bento}>
          <article id="speed" className={`${styles.card} ${styles.speed} ${styles.wide}`}>
            <div>
              <span className={`${styles.pill} ${styles.bluePill}`}>PERFORMANS</span>
              <h3>{t('100ms Altında Tanıma')}</h3>
              <p>{t('Jet hızında bariyer açılışı. Sahada bekleme yapmadan akıcı geçiş deneyimi.')}</p>
            </div>
            <div className={styles.glow} />
            <div className={styles.bolt} aria-hidden="true">
              ⚡
            </div>
          </article>

          <article id="tech" className={`${styles.card} ${styles.tech}`}>
            <div>
              <div className={styles.techTop}>
                <span className={styles.nvidia}>NVIDIA</span>
                <span className={`${styles.pill} ${styles.greenPill}`}>JETSON</span>
              </div>
              <h3>{t('Nvidia CUDA Gücü')}</h3>
              <p>{t('Jetson Orin Nano ile tek cihazda 4 kamera işleme teknolojisi.')}</p>
            </div>
            <div className={styles.techMeta}>
              <span>40 TOPS</span>
              <span>1024 CORES</span>
            </div>
          </article>

          <article id="data" className={`${styles.card} ${styles.power}`}>
            <div>
              <div className={styles.leaf} aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 8C8 10 6 16 6 21c6 0 11-5 13-13-1 2-4 4-8 5 4-3 6-7 6-5z" />
                </svg>
              </div>
              <h3>{t('Sadece 15W Güç')}</h3>
              <p>{t('Bir ampul kadar enerji ile tüm otoparkınızı yönetin, karbon ayak izinizi düşürün.')}</p>
            </div>
            <div className={styles.watt}>
              15W<span>/ saat</span>
            </div>
          </article>

          <article id="success" className={`${styles.card} ${styles.success} ${styles.wide}`}>
            <div className={styles.halo} />
            <div>
              <span className={`${styles.pill} ${styles.whitePill}`}>{t('SAHA VERİSİ')}</span>
              <h3>{t('Gerçek Saha Başarısı')}</h3>
              <p>
                {t('Kar, yağmur, çamur, sis veya gece karanlığı fark etmez. Sistemimiz en kötü koşullarda bile plakayı görür, tanır ve onaylar.')}
              </p>
            </div>
            <div className={styles.ringWrap}>
              <svg viewBox="0 0 160 160" aria-hidden="true">
                <circle cx="80" cy="80" r="70" fill="none" stroke="#1f2937" strokeWidth="10" />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="10"
                  strokeDasharray="440"
                  strokeDashoffset="4.4"
                  strokeLinecap="round"
                />
              </svg>
              <div className={styles.pct}>%99</div>
            </div>
          </article>
        </section>

        <section className={styles.finale}>
          <span className={styles.kicker}>{t('Endüstri Standartlarının Ötesinde')}</span>
          <h2>{t('Teknolojinin Zirvesi.')}</h2>
          <p>
            {t('Visiosoft Plaka Tanıma Sistemi, sadece bir kamera değil; derin öğrenme algoritmalarıyla sürekli gelişen, kendi kendine yetebilen bir yapay zeka ekosistemidir.')}
          </p>
          <div className={styles.stats}>
            <div>
              <strong>6.5M+</strong>
              <span>{t('Eğitim Verisi')}</span>
            </div>
            <div>
              <strong>%99.9</strong>
              <span>{t('Doğruluk')}</span>
            </div>
            <div>
              <strong>0.1s</strong>
              <span>{t('Tepki Süresi')}</span>
            </div>
            <div>
              <strong>7/24</strong>
              <span>{t('Kesintisiz')}</span>
            </div>
          </div>
          <Link to={path('contact')} className={styles.meet}>
            {t('Mühendislerimizle Tanışın')} →
          </Link>
        </section>
      </main>
    </>
  )
}
