import Seo from '../../components/Seo/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import styles from './ParkingViolations.module.css'

const violations = [
  { mark: 'EV', label: 'Çift şarj alanına park etme' },
  { mark: '||', label: 'Çift park slotuna park etme' },
  { mark: '/', label: 'Hat ihlali park etme' },
  { mark: '□', label: 'Slot dışına park etme' },
  { mark: 'A', label: 'Engelli araç park yeri' },
  { mark: 'G', label: 'Şarj slotuna fosil yakıtlı araç' },
  { mark: '×', label: 'İşaretlenmiş slota park etme' },
  { mark: 'K', label: 'Kiralanmış slota park etme' },
] as const

export default function ParkingViolations() {
  const { t } = useLocale()

  return (
    <>
      <Seo
        title={t('Akıllı Park Sistemi - Visiosoft')}
        description={t('Gereksiz kullanım ve işgaliyenin önüne geçerek, Akıllı Park Sistemi ile kazanç kaybınızı önleyin.')}
      />

      <div className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroGrid}>
            <div>
              <p className={styles.badge}>{t('Yapay Zeka Destekli')}</p>
              <h1>
                {t('Akıllı Park')}
                <br />
                <span>{t('Sistemi')}</span>
              </h1>
              <p className={styles.lead}>
                {t('Gereksiz kullanım ve işgaliyenin önüne geçerek, Akıllı Park Sistemi ile kazanç kaybınızı önleyin.')}
              </p>
              <p className={styles.copy}>
                {t(
                  'İnsan müdahalesine ihtiyaç duymadan çalışan yapay zeka destekli denetim altyapısı, ihlalleri anında tespit ederek kurallara sürekli uyum sağlar.',
                )}
              </p>
            </div>

            <div className={styles.visual}>
              <div className={styles.ringOuter} aria-hidden="true" />
              <div className={styles.ringInner} aria-hidden="true" />
              <div className={styles.photo}>
                <img src="/img/Otopark.jpg" alt={t('Akıllı Park Sistemi')} />
                <div className={styles.overlay}>
                  <p>{t('CANLI ANALİZ AKTİF')}</p>
                  <div>
                    <div>
                      <span>{t('Tespit Edilen Araç')}</span>
                      <strong>34 ABC 123</strong>
                    </div>
                    <div>
                      <span>{t('Durum')}</span>
                      <em>{t('İzinli Giriş')}</em>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="teknik-detaylar" className={styles.section}>
          <div className={styles.panel}>
            <h2>{t('İşgaliye ve Park Ceza Durumları')}</h2>
            <div className={styles.grid}>
              {violations.map((item) => (
                <article key={item.label}>
                  <span>{item.mark}</span>
                  <p>{t(item.label)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
