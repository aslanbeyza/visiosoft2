import { Link } from 'react-router-dom'
import CorporateStory from '../../components/CorporateStory/index.ts'
import Hero from '../../components/Hero/index.ts'
import KioskZoom from '../../components/KioskZoom/index.ts'
import ParkSoftware from '../../components/ParkSoftware/index.ts'
import Seo from '../../components/Seo/index.ts'
import StoryFrame from '../../components/StoryFrame/index.ts'
import SystemShowcase from '../../components/SystemShowcase/index.ts'
import BentoTilt from '../../components/BentoTilt/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import styles from './Home.module.css'

export default function Home() {
  const { t } = useLocale()
  const path = usePath()

  return (
    <>
      <Seo title={t('Visiosoft - İnsansız Otopark Yönetim Sistemleri')} description={t('meta_desc_index')} />

      <Hero />

      <CorporateStory />

      <ParkSoftware />

      <SystemShowcase />

      <KioskZoom />

      <StoryFrame />

      <section className={styles.support}>
        <div className={styles.supportGrid}>
          <div>
            <p className={styles.kicker}>{t('index_operation_label')}</p>
            <h2>
              {t('index_need_support_title')}
              <span> {t('index_here_724_title')}</span>
            </h2>
            <p>{t('support_description')}</p>
          </div>
          <div className={styles.statusList}>
            <div>
              <strong>{t('index_system_status_normal')}</strong>
              <span>{t('index_all_hardware_active')}</span>
            </div>
            <div>
              <strong>{t('index_incoming_call')}</strong>
              <span>{t('index_operator_responding')}</span>
            </div>
            <div>
              <strong>{t('index_daily_revenue')}</strong>
              <span>{t('index_accounting_integration')}</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.white}>
        <div className={styles.three}>
          <BentoTilt>
            <Link to={path('plate-recognition-system')} className={styles.jump}>
              <span>01</span>
              <h2>{t('Plaka Tanıma Yazılımı')}</h2>
            </Link>
          </BentoTilt>
          <BentoTilt>
            <Link to={path('hardware-products')} className={styles.jump}>
              <span>02</span>
              <h2>{t('Otopark Donanımları')}</h2>
            </Link>
          </BentoTilt>
          <BentoTilt>
            <Link to={path('services')} className={styles.jump}>
              <span>03</span>
              <h2>{t('Destek ve Takip Hizmetleri')}</h2>
            </Link>
          </BentoTilt>
        </div>
      </section>
    </>
  )
}
