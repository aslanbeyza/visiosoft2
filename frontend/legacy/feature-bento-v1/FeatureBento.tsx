import { Link } from 'react-router-dom'
import AnimatedTitle from '../AnimatedTitle/index.ts'
import ProductViewer from '../ProductViewer/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { products } from '../../pages/HardwareProduct/products.ts'
import { featureBentoCopy } from './featureBentoCopy.ts'
import styles from './FeatureBento.module.css'

export default function FeatureBento() {
  const { t } = useLocale()
  const path = usePath()
  const text = featureBentoCopy

  return (
    <section className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.intro}>
          <p className={styles.kicker}>{text.kicker}</p>
          <AnimatedTitle lines={text.title} className={styles.title} />
          <p className={styles.lead}>{text.lead}</p>
        </div>

        <article className={styles.heroCard}>
          <div className={styles.stage}>
            <ProductViewer
              src={products['kamera-muhafaza'].model}
              poster={products['kamera-muhafaza'].technicalImage}
            />
          </div>
          <Link to={path('plate-recognition-system')} className={styles.bodyLink}>
            <span className={styles.tag}>{t('nav_alpr')}</span>
            <h3>{t('Plaka Tanıma Yazılımı')}</h3>
            <p>{text.alprLead}</p>
          </Link>
        </article>

        <div className={styles.grid}>
          <article className={`${styles.card} ${styles.tall}`}>
            <div className={styles.stage}>
              <ProductViewer src={products.kiosk.model} poster={products.kiosk.technicalImage} />
            </div>
            <Link to={path('hardware-products.kiosk')} className={styles.bodyLink}>
              <span className={styles.tag}>{t('footer_hardware')}</span>
              <h3>{t('index_unmanned_kiosk_title')}</h3>
              <p>{t('kiosk_description')}</p>
            </Link>
          </article>

          <article className={styles.card}>
            <div className={styles.stage}>
              <ProductViewer src={products.visiobox.model} poster={products.visiobox.technicalImage} />
            </div>
            <Link to={path('hardware-products.visiobox')} className={styles.bodyLink}>
              <span className={styles.tag}>{t('index_control_box_label')}</span>
              <h3>{t('Visiobox')}</h3>
              <p>{t('index_visiobox_desc')}</p>
            </Link>
          </article>

          <article className={styles.card}>
            <div className={styles.stage}>
              <ProductViewer
                src={products['kamera-muhafaza'].model}
                poster={products['kamera-muhafaza'].technicalImage}
              />
            </div>
            <Link to={path('hardware-products.kamera-muhafaza')} className={styles.bodyLink}>
              <span className={styles.tag}>{t('index_protection_label')}</span>
              <h3>{t('index_visio_camera_title')}</h3>
              <p>{t('index_camera_housing_desc')}</p>
            </Link>
          </article>
        </div>

        <div className={styles.pair}>
          <Link to={path('hardware-products')} className={styles.ctaCard}>
            <h3>{t('index_modular_hardware_title')}</h3>
            <span>{text.more} →</span>
          </Link>
          <article className={styles.card}>
            <div className={styles.stage}>
              <ProductViewer src={products['kamera-montaj-kulesi'].model} />
            </div>
            <Link to={path('hardware-products.kamera-montaj-kulesi')} className={styles.bodyLink}>
              <span className={styles.tag}>{t('index_protection_label')}</span>
              <h3>{products['kamera-montaj-kulesi'].navLabel}</h3>
              <p>Sürükleyin, yakınlaştırmak için kaydırın.</p>
            </Link>
          </article>
        </div>
      </div>
    </section>
  )
}
