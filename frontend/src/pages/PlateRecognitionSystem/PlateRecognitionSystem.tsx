import Button from '../../components/Button/index.ts'
import Seo from '../../components/Seo/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import styles from './PlateRecognitionSystem.module.css'

const features = [
  { title: 'Hızlı Tanıma', copy: 'Milisaniyeler içinde plaka okuma ve tanıma' },
  { title: 'Yüksek Doğruluk', copy: '%99 üzeri doğruluk oranı ile güvenilir sonuçlar' },
  { title: 'Gece Görüşü', copy: '7/24 kesintisiz çalışma, gece-gündüz fark etmez' },
  { title: 'Bulut Tabanlı', copy: 'Her yerden erişim ve merkezi yönetim imkanı' },
  { title: 'Veri Analizi', copy: 'Detaylı raporlama ve iş zekası analitiği' },
  { title: 'Mobil Erişim', copy: 'Mobil uygulama ile anlık takip ve yönetim' },
]

export default function PlateRecognitionSystem() {
  const { t } = useLocale()
  const path = usePath()

  return (
    <>
      <Seo title={t('Plaka Tanıma Sistemi | PTS Teknolojisi | Visiosoft')} description={t('lpr_page_meta_desc')} />

      <section className={styles.page}>
        <main className={styles.inner}>
          <section className={styles.hero}>
            <div>
              <h1>{t('Plaka Tanıma Sistemi')}</h1>
              <p>{t('lpr_hero_description')}</p>
            </div>
            <div className={styles.heroImage}>
              <img src="/img/pages/gercek_otopark_isvev_kus_bakisi.webp" alt={t('Plaka Tanıma Sistemi')} />
              <span className={styles.liveChip}>
                <i />
                {t('Otomatik Tanıma')}
              </span>
            </div>
          </section>

          <section className={styles.explainer}>
            <h2>{t('Plaka Tanıma Sistemi Nedir?')}</h2>
            <p>{t('what_is_lpr_desc_1')}</p>
            <p>{t('what_is_lpr_desc_2')}</p>
          </section>

          <section className={styles.features}>
            <h2>{t('Sistem Özellikleri')}</h2>
            <div className={styles.featureGrid}>
              {features.map((item) => (
                <article key={item.title}>
                  <h3>{t(item.title)}</h3>
                  <p>{t(item.copy)}</p>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.cta}>
            <h2>{t('Başlamaya Hazır mısınız?')}</h2>
            <p>{t('lpr_ready_to_start_desc')}</p>
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
