import { Link } from 'react-router-dom'
import Seo from '../../components/Seo/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import styles from './Developers.module.css'

const gatePoints = [
  'Cihaz online/offline durum takibi ve alarm yönetimi',
  'Canlı oturum, geçiş ve ödeme event yayınları',
  'Saha komutları için güvenli çift yönlü iletişim',
  'Kendi UI panelinizi veya mobil operasyon ekranınızı geliştirme imkanı',
] as const

const zonePoints = [
  'Çoklu tesis verisini tek API anahtarıyla yönetim',
  'Detaylı yetkilendirme ve tenant bazlı erişim modeli',
  'Webhook ile ödeme, ihlal, cihaz alarmı ve abonelik olay tetikleme',
  'Kendi raporlama, faturalama ve müşteri portalınızı oluşturma desteği',
] as const

const coreStack = [
  { name: 'Laravel', note: 'Robust Framework' },
  { name: 'PHP 8.5', note: 'High Performance' },
  { name: 'PMSP Server', note: 'NodeJS' },
] as const

const aiStack = [
  { name: 'Python AI', note: 'Deep Learning' },
  { name: 'OpenCV', note: 'Image Processing' },
  { name: 'LPR Systems', note: '99.9% Accuracy' },
] as const

const opsStack = [
  { name: 'Live Dashboard', note: 'Clear overview' },
  { name: 'Automated Tasks', note: 'Background automation' },
  { name: 'Error Alerts', note: 'Issue notifications' },
  { name: 'Server Health', note: 'System status' },
] as const

export default function Developers() {
  const { t } = useLocale()
  const path = usePath()

  return (
    <>
      <Seo
        title={t('Hedef Yazılımcılar - Visiosoft')}
        description={t(
          'GATE SDK ve ZONE API ile sahadaki cihazlardan gerçek zamanlı veri alın, kendi uygulamalarınızı geliştirin ve webhook ile süreçleri otomatikleştirin.',
        )}
      />

      <section className={styles.page}>
        <div className={styles.container}>
          <header className={styles.hero}>
            <p className={styles.kicker}>{t('Hedef Yazılımcılar')}</p>
            <h1>{t('Developers to Developers')}</h1>
            <p className={styles.subtitle}>
              {t("2004'den beri kod yazan ben sizi anlıyorum. SDK ve REST API hazır. Gelin birlikte geliştirelim.")}
            </p>
            <div className={styles.chips}>
              <a href="#gate-sdk">{t('GATE SDK')}</a>
              <a href="#zone-api">{t('ZONE API')}</a>
              <a href="#tech-stack">{t('Teknoloji Omurgası')}</a>
            </div>
          </header>

          <section className={styles.section}>
            <div className={styles.grid2}>
              <article id="gate-sdk" className={styles.card}>
                <p className={styles.cardKicker}>{t('GATE Yazılımı')}</p>
                <h2>{t('SDK + WebSocket ile Gerçek Zamanlı Cihaz Erişimi')}</h2>
                <p>
                  {t(
                    'GATE SDK ile sahadaki kiosk, bariyer, ödeme terminali ve sensörleri anlık olarak dinleyebilir; WebSocket üzerinden tüm olayları doğrudan kendi uygulamanıza akıtabilirsiniz.',
                  )}
                </p>
                <ul>
                  {gatePoints.map((key) => (
                    <li key={key}>{t(key)}</li>
                  ))}
                </ul>
                <pre className={styles.code}>
                  wss://gate.visiosoft.com.tr/stream | {'{"event":"device.status","state":"online"}'}
                </pre>
              </article>

              <article id="zone-api" className={styles.card}>
                <p className={styles.cardKicker}>{t('ZONE Bulut')}</p>
                <h2>{t('REST API + Webhook ile Uçtan Uca Entegrasyon')}</h2>
                <p>
                  {t(
                    'ZONE API ile tahsilat, abonelik, oturum, doluluk ve kullanıcı verisini ERP, CRM veya finans sistemlerinize bağlayabilir; webhook ile kritik olayları otomatik tetikleyebilirsiniz.',
                  )}
                </p>
                <ul>
                  {zonePoints.map((key) => (
                    <li key={key}>{t(key)}</li>
                  ))}
                </ul>
                <pre className={styles.code}>
                  POST https://zone.visiosoft.com.tr/api/v1/webhooks | {'{"event":"payment.completed"}'}
                </pre>
              </article>
            </div>
          </section>

          <section id="tech-stack" className={styles.section}>
            <div className={styles.stackHead}>
              <p>{t('Altyapı')}</p>
              <h2>{t('Mühendislik Harikası')}</h2>
              <p className={styles.stackSub}>{t('Kategorize edilmiş, yüksek performanslı ve güvenli modern mimari.')}</p>
            </div>

            <div className={styles.grid2}>
              <article className={styles.techCard}>
                <div className={styles.techHead}>
                  <span className={`${styles.techIcon} ${styles.blue}`}>CPU</span>
                  <div>
                    <h3>{t('Core & Backend')}</h3>
                    <p>{t('Omurga Mimarisi')}</p>
                  </div>
                </div>
                <div className={styles.techList}>
                  {coreStack.map((item) => (
                    <div key={item.name} className={styles.techRow}>
                      <strong>{item.name}</strong>
                      <span>{item.note}</span>
                    </div>
                  ))}
                </div>
              </article>

              <article className={styles.techCard}>
                <div className={styles.techHead}>
                  <span className={`${styles.techIcon} ${styles.yellow}`}>AI</span>
                  <div>
                    <h3>{t('Yapay Zeka & Saha')}</h3>
                    <p>Edge Computing</p>
                  </div>
                </div>
                <div className={styles.techList}>
                  {aiStack.map((item) => (
                    <div key={item.name} className={styles.techRow}>
                      <strong>{item.name}</strong>
                      <span>{item.note}</span>
                    </div>
                  ))}
                </div>
              </article>

              <article className={styles.techCard}>
                <div className={styles.techHead}>
                  <span className={`${styles.techIcon} ${styles.orange}`}>OPS</span>
                  <div>
                    <h3>{t('DevOps & İzleme')}</h3>
                    <p>24/7 System Health</p>
                  </div>
                </div>
                <div className={styles.opsGrid}>
                  {opsStack.map((item) => (
                    <div key={item.name} className={styles.techRow}>
                      <strong>{item.name}</strong>
                      <span>{item.note}</span>
                    </div>
                  ))}
                </div>
              </article>

              <article className={styles.techCard}>
                <div className={styles.storage}>
                  <div>
                    <span className={`${styles.techIcon} ${styles.pg}`}>PG</span>
                    <small>PostgreSQL</small>
                  </div>
                  <div className={styles.storageMid}>
                    <h3>{t('Veri & Depolama')}</h3>
                    <p>Sync & Backup</p>
                    <span className={`${styles.techIcon} ${styles.redis}`}>RD</span>
                    <small>Redis</small>
                  </div>
                  <div>
                    <span className={`${styles.techIcon} ${styles.aws}`}>S3</span>
                    <small>AWS S3</small>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <section className={styles.cta}>
            <p className={styles.kicker}>{t('Integrasyon Örnekleri')}</p>
            <h2>{t('Kendi Ürününüzü Bu Altyapı Üzerinde Geliştirebilirsiniz')}</h2>
            <p>
              {t(
                'Ödeme uygulamanızı, kurumsal raporlama ekranınızı, saha operasyon panelinizi veya mobil müşteri deneyiminizi GATE ve ZONE altyapısı üzerine kurabilirsiniz. Ekipleriniz için API-first, güvenli ve sürdürülebilir bir geliştirme zemini sağlıyoruz.',
              )}
            </p>
            <div className={styles.ctaLinks}>
              <Link to={path('software-products')}>{t('Yazılım Ürünleri')} →</Link>
              <Link to={path('contact')}>{t('Teknik Ekip ile Görüşün')}</Link>
            </div>
          </section>
        </div>
      </section>
    </>
  )
}
