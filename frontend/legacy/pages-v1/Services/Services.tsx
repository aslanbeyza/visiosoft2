import Button from '../../components/Button/index.ts'
import Seo from '../../components/Seo/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import styles from './Services.module.css'

const navItems = [
  { href: '#discovery', label: 'Keşif & Kurulum' },
  { href: '#support', label: '7/24 Destek' },
  { href: '#monitoring', label: 'Uzaktan İzleme' },
  { href: '#accounting', label: 'Resmi Muhasebe' },
] as const

export default function Services() {
  const { t } = useLocale()
  const path = usePath()

  return (
    <>
      <Seo
        title={t('Hizmetlerimiz - Visiosoft')}
        description={t(
          'Keşif, kurulum, 7/24 destek ve bakım hizmetleri. Otopark işletmenizin tüm teknik ve operasyonel ihtiyaçları için yanınızdayız.',
        )}
      />

      <div className={styles.page}>
        <main className={styles.main}>
          <section className={styles.hero}>
            <h1>
              <span className={styles.heroRow}>
                <span>{t('Yanınızda')}</span>
                <span className={styles.ekgWrap} aria-hidden="true">
                  <span className={styles.heart}>♥</span>
                  <svg className={styles.ekg} viewBox="0 0 300 100" fill="none">
                    <path
                      className={styles.ekgLine}
                      d="M0 50 L30 50 L45 50 L60 20 L75 80 L90 10 L105 90 L120 50 L150 50 L165 50 L180 20 L195 80 L210 10 L225 90 L240 50 L300 50"
                    />
                  </svg>
                </span>
              </span>
              <span className={styles.muted}>{t('7/24.')}</span>
            </h1>
            <p>{t('Bünyemizdeki saha ve müşteri destek ekipleriyle tek bir muhatabınız var, biz. İşimizi şansa bırakamayız.')}</p>
            <div className={styles.actions}>
              <Button to={path('discovery.show')}>{t('Keşife Gelelim')}</Button>
              <Button to={path('quote.index')} variant="ghost">
                {t('Sipariş Ver')} →
              </Button>
            </div>
            <div className={styles.scrollHint} aria-hidden="true">
              ↓
            </div>
          </section>

          <nav className={styles.nav} aria-label={t('Hizmetlerimiz')}>
            <div className={styles.navInner}>
              {navItems.map((item) => (
                <a key={item.href} href={item.href}>
                  <span />
                  {t(item.label)}
                </a>
              ))}
            </div>
          </nav>

          <section className={styles.bento}>
            <article id="discovery" className={`${styles.panel} ${styles.wide}`}>
              <div>
                <div className={styles.radar} aria-hidden="true">
                  <div className={styles.radarPing} />
                  <div className={styles.radarCore}>+</div>
                </div>
                <h3>{t('Keşif ve Kurulum.')}</h3>
                <p>
                  {t(
                    'Mühendislerimiz alanınızı analiz eder, en verimli donanım yerleşimini planlar ve anahtar teslim kurulum yapar.',
                  )}
                </p>
              </div>
              <div className={styles.accentLine} />
            </article>

            <article id="support" className={styles.panel}>
              <div>
                <div className={`${styles.icon} ${styles.green}`}>▶</div>
                <h3>{t('7/24 Görüntülü Destek.')}</h3>
                <p>{t('Sürücüler için anlık sesli ve görüntülü yardım asistanı.')}</p>
              </div>
              <div className={styles.watermark}>24/7</div>
            </article>

            <article id="accounting" className={`${styles.panel} ${styles.full}`}>
              <div className={styles.accountCopy}>
                <div className={`${styles.icon} ${styles.amber}`}>₺</div>
                <h3>{t('Resmi Muhasebe.')}</h3>
                <p>
                  {t(
                    'Yazılım ve hizmetlerimiz sayesinde Abonelik ve Otopark gelirleri efatura ve e-arşiv elektronik ortamda faturalarınız müşterilerinize ulaştırılır.',
                  )}
                </p>
              </div>
              <div className={styles.invoice} aria-hidden="true">
                <div className={styles.invoiceHead}>
                  <span />
                  <em />
                </div>
                <div className={styles.invoiceLines}>
                  <span />
                  <span />
                  <span />
                </div>
                <strong>₺24.500</strong>
              </div>
            </article>
          </section>

          <section id="monitoring" className={styles.monitor}>
            <div className={styles.monitorInner}>
              <div>
                <div className={styles.liveBadge}>
                  <span />
                  {t('Canlı İzleme')}
                </div>
                <h2>{t('Kameraları canlı izleyin, ödemeyi uzaktan yönetin.')}</h2>
                <p>
                  {t(
                    'Operasyon ekibimiz giriş, çıkış ve ödeme noktalarını tek ekranda takip eder. Gerekli olduğunda uzaktan müdahale ederek akışın durmamasını sağlar.',
                  )}
                </p>
                <div className={styles.miniCards}>
                  <article>
                    <strong>{t('Canlı kamera')}</strong>
                    <p>{t('Giriş ve çıkış noktalarını anlık görün.')}</p>
                  </article>
                  <article>
                    <strong>{t('Uzaktan ödeme kontrolü')}</strong>
                    <p>{t('Ödeme noktasını uzaktan yönetin.')}</p>
                  </article>
                  <article>
                    <strong>{t('Anlık durum takibi')}</strong>
                    <p>{t('Sahadaki hareketi tek panelden izleyin.')}</p>
                  </article>
                </div>
              </div>

              <div className={styles.console}>
                <div className={styles.camera}>
                  <div className={styles.cameraHead}>
                    <span>{t('Giriş kamerası')}</span>
                    <em>
                      <i />
                      {t('Canlı')}
                    </em>
                  </div>
                  <div className={styles.viewport}>
                    <div className={styles.plate}>
                      <b>TR</b>
                      <span>34 VS 1923</span>
                    </div>
                    <div className={styles.scan} />
                  </div>
                </div>
                <div className={styles.side}>
                  <div className={styles.statusCard}>
                    <span>{t('Ödeme noktası')}</span>
                    <strong>{t('Ödeme aktif')}</strong>
                    <em>
                      <i />
                      {t('Hazır')}
                    </em>
                  </div>
                  <div className={styles.statusCard}>
                    <span>{t('Canlı olay akışı')}</span>
                    <div className={styles.events}>
                      <div>
                        <b>{t('Giriş kamerası')}</b>
                        <em>{t('Canlı')}</em>
                      </div>
                      <div>
                        <b>{t('Uzaktan ödeme kontrolü')}</b>
                        <em className={styles.ready}>{t('Hazır')}</em>
                      </div>
                      <div>
                        <b>{t('Anlık durum takibi')}</b>
                        <em className={styles.ms}>12ms</em>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.bottomCta}>
            <h2>{t('Geleceğe Park Et.')}</h2>
            <Button to={path('contact')}>{t('Hemen Başvur')}</Button>
          </section>
        </main>
      </div>
    </>
  )
}
