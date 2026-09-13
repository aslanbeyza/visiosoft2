import { Link } from 'react-router-dom'
import Seo from '../../components/Seo/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import styles from './SoftwareProducts.module.css'

export default function SoftwareProducts() {
  const { t } = useLocale()
  const path = usePath()
  const userName = 'Ahmet Yılmaz'

  return (
    <>
      <Seo title={t('sw_page_title')} description={t('sw_meta_description')} />

      <section className={styles.hero}>
        <h1>{t('sw_hero_title')}</h1>
        <p>{t('sw_subtitle')}</p>
        <Link to={path('developers')} className={styles.devLink}>
          {t('sw_dev_to_dev')} →
        </Link>

        <div className={styles.diagram} aria-hidden="true">
          <div className={styles.cloud}>☁</div>
          <div className={styles.arc} />
          <div className={styles.nodes}>
            <div className={styles.node}>
              <span className={styles.dot} />
              <div className={styles.box}>🚗</div>
            </div>
            <div className={styles.node}>
              <span className={`${styles.dot} ${styles.dotGreen}`} />
              <div className={styles.box}>P</div>
            </div>
            <div className={styles.node}>
              <span className={styles.dot} />
              <div className={styles.box}>🚗</div>
            </div>
          </div>
        </div>
      </section>

      <nav className={styles.subnav} aria-label={t('Park Yazılım')}>
        <Link to={path('end-to-end')}>
          <span>🔗</span>
          {t('Uçtan Uca')}
        </Link>
        <Link to={path('on-street')}>
          <span>🛣</span>
          {t('Yol Üstü')}
        </Link>
        <Link to={path('parking-violations')}>
          <span>⚠</span>
          {t('İşgaliye')}
        </Link>
        <a href="#mobile-app">
          <span>📱</span>
          {t('Mobil Çözüm')}
        </a>
        <Link to={path('developers')}>
          <span>🖥</span>
          {t('Geliştiriciler')}
        </Link>
      </nav>

      <section className={styles.features}>
        <div className={styles.row}>
          <div>
            <p className={styles.kicker}>{t('index_gelir_yonetimi')}</p>
            <h2>{t('Tahsilatı tek panelden yönetin.')}</h2>
            <p className={styles.copy}>{t('Gelir raporları, otomatik tahsilat ve kaçak önleme tek akışta toplansın.')}</p>
            <div className={styles.pills}>
              <article>
                <strong>{t('index_gelir_raporlari')}</strong>
                <span>{t('Günlük ve dönemsel geliri net görün.')}</span>
              </article>
              <article>
                <strong>{t('index_otomatik_tahsilat')}</strong>
                <span>{t('Ödeme sürecini daha az manuel adımla yönetin.')}</span>
              </article>
              <article>
                <strong>{t('index_kacak_onleme')}</strong>
                <span>{t('Kayıp riskini azaltan düzenli bir yapı kurun.')}</span>
              </article>
            </div>
          </div>
          <div className={styles.panel}>
            <div className={styles.stats}>
              <div>
                <p>{t('index_toplam_gelir')}</p>
                <strong>₺124,500</strong>
              </div>
              <div>
                <p>{t('index_tahsilat_basarisi')}</p>
                <strong>%99.9</strong>
              </div>
            </div>
            <div className={styles.chart}>
              <div className={styles.chartHead}>
                <span>{t('Gelir Akışı')}</span>
                <span>₺450.20</span>
              </div>
              <svg viewBox="0 0 360 120" preserveAspectRatio="none" className={styles.line}>
                <path d="M0,92 C62,86 98,34 138,42 C176,50 198,76 238,66 C280,56 314,18 360,24" />
              </svg>
            </div>
          </div>
        </div>

        <div id="mobile-app" className={`${styles.row} ${styles.reverse}`}>
          <div className={styles.phoneWrap}>
            <div className={styles.phone}>
              <div className={styles.phoneTop}>
                <div>
                  <p>{t('sw_welcome')}</p>
                  <strong>{userName}</strong>
                </div>
                <span className={styles.avatar} />
              </div>
              <div className={styles.package}>
                <p>{t('sw_active_package')}</p>
                <strong>{t('sw_monthly_membership')}</strong>
                <div>
                  <b>3000 TL<span>/ay</span></b>
                  <em>{t('sw_saved_credit_card')}</em>
                </div>
              </div>
              <div className={styles.apps}>
                <div>
                  <strong>{t('footer_corporate')}</strong>
                  <span>e-Fatura</span>
                </div>
                <div>
                  <strong>{t('sw_debt_payment')}</strong>
                  <span>{t('sw_credit_card')}</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <p className={`${styles.kicker} ${styles.orange}`}>VISIO APP</p>
            <h2>{t('Mobilde ödeme ve abonelik.')}</h2>
            <p className={styles.copy}>{t('Borç ödeme, abonelik ve kurumsal işlemleri tek uygulamada toplayın.')}</p>
            <div className={styles.pills}>
              <article>
                <strong>{t('sw_monthly_membership')}</strong>
                <span>3000 TL/ay</span>
              </article>
              <article>
                <strong>{t('sw_debt_payment')}</strong>
                <span>{t('Kart ile hızlı ödeme')}</span>
              </article>
              <article>
                <strong>{t('footer_corporate')}</strong>
                <span>e-Fatura</span>
              </article>
            </div>
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <p className={`${styles.kicker} ${styles.indigo}`}>{t('Canlı İzleme')}</p>
            <h2>{t('Sistemi anlık izleyin.')}</h2>
            <p className={styles.copy}>{t('Performans, cihaz durumu ve gecikmeleri tek ekranda görün.')}</p>
            <div className={styles.pills}>
              <article>
                <strong>{t('index_live_tracking')}</strong>
                <span>{t('Sahadaki hareketi anlık takip edin.')}</span>
              </article>
              <article>
                <strong>{t('index_ready_badge')}</strong>
                <span>{t('Cihaz ve servis durumunu görün.')}</span>
              </article>
              <article>
                <strong>{t('PMSP Gecikme')}</strong>
                <span>{t('Kritik performans değerlerini izleyin.')}</span>
              </article>
            </div>
          </div>
          <div className={styles.monitor}>
            <h3>{t('Canlı İzleme')}</h3>
            <p>{t('sw_monitor_desc')}</p>
            <div className={styles.metrics}>
              <div>
                <span>{t('index_live_tracking')}</span>
                <div className={styles.bars}>
                  <i /><i /><i /><i /><i />
                </div>
              </div>
              <div>
                <span>{t('index_ready_badge')}</span>
                <strong>1,248</strong>
              </div>
              <div className={styles.wide}>
                <span>{t('PMSP Gecikme')}</span>
                <strong>12ms</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.cards}>
        {[
          { route: 'end-to-end', title: 'footer_end_to_end_system', desc: 'sw_end_to_end_desc', tone: styles.green },
          { route: 'on-street', title: 'footer_on_street_parking', desc: 'sw_on_street_desc', tone: styles.blue },
          { route: 'parking-violations', title: 'footer_parking_violations', desc: 'sw_violation_desc', tone: styles.warn },
          { route: 'hgs', title: 'footer_hgs_payment', desc: 'sw_hgs_desc', tone: styles.yellow },
          { route: 'kus-bakisi', title: 'footer_birds_eye_management', desc: 'sw_birds_eye_desc', tone: styles.purple },
        ].map((item) => (
          <Link key={item.route} to={path(item.route)} className={styles.card}>
            <div className={`${styles.icon} ${item.tone}`} />
            <h3>{t(item.title)}</h3>
            <p>{t(item.desc)}</p>
          </Link>
        ))}
      </section>
    </>
  )
}
