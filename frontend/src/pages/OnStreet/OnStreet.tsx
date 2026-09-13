import Button from '../../components/Button/index.ts'
import Seo from '../../components/Seo/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import styles from './OnStreet.module.css'

export default function OnStreet() {
  const { t } = useLocale()
  const path = usePath()

  return (
    <>
      <Seo
        title={t('Yol Üstü Parklandırma - Visiosoft')}
        description={t('Yol kenarı park yerlerinde kamera ile yapay zeka destekli çözüm. HGS entegrasyonu ile otomatik ücretlendirme.')}
      />

      <section className={styles.page}>
        <div className={styles.grid}>
          <div className={styles.copy}>
            <h1>{t('Yol Üstü Parklandırma')}</h1>
            <p className={styles.lead}>{t('Yol kenarı park yerlerinde kamera ile yapay zeka destekli çözüm.')}</p>
            <p>
              {t(
                'Özel geliştirdiğimiz yazılım sayesinde yol üzerine yerleştirilen kamera ile plaka tespiti yapılıp HGS üzerinden ücret çekilmektedir.',
              )}
            </p>
            <p>
              {t(
                'PTS kameralar sayesinde yol üstü park yerlerinden ücret alınabilir. Ayrıca el terminalleri ile personel kullanarak ödeme alınabilir.',
              )}
            </p>
            <div className={styles.actions}>
              <Button to={path('contact')}>{t('Daha Fazla Bilgi')}</Button>
            </div>
          </div>

          <div className={styles.visual}>
            <div className={styles.glow} aria-hidden="true" />
            <div className={styles.frame}>
              <img src="/img/pages/yol_ustu.webp" alt={t('Yol Üstü Parklandırma')} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
