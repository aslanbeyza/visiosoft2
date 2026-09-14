import Button from '../../components/Button/index.ts'
import Seo from '../../components/Seo/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import styles from './Comparison.module.css'

type VisioExtra = 'live' | 'ai' | 'auto'

type Row = {
  feature: string
  tip: string
  traditional: { kind: 'text' | 'no'; text?: string }
  visio: { kind: 'text' | 'ok'; text?: string; extra?: VisioExtra }
}

export default function Comparison() {
  const { t } = useLocale()
  const path = usePath()

  const rows: Row[] = [
    {
      feature: t('İşletim Sistemi'),
      tip: t('Sistemin üzerinde çalıştığı işletim sistemi. Pardus ve Ubuntu ücretsiz ve açık kaynaklı Linux dağıtımlarıdır.'),
      traditional: { kind: 'text', text: t('Windows') },
      visio: { kind: 'text', text: t('Pardus & Ubuntu') },
    },
    {
      feature: t('Uzaktan Erişim'),
      tip: t('Otoparkınıza internet üzerinden her yerden bağlanabilme özelliği. Evden, ofisten veya seyahatte bile sisteminizi yönetebilirsiniz.'),
      traditional: { kind: 'no' },
      visio: { kind: 'ok', text: t('Her yerden') },
    },
    {
      feature: t('Canlı Görüntü İzleme'),
      tip: t('Giriş-çıkış kameralarından canlı görüntü izleme. Otoparktaymış gibi her şeyi anında görün.'),
      traditional: { kind: 'no' },
      visio: { kind: 'ok', text: t('Gerçek zamanlı'), extra: 'live' },
    },
    {
      feature: t('Tahsilat Başarısı'),
      tip: t('Otopark ücretlerinin başarılı bir şekilde tahsil edilme oranı. VisioPark ile kaçak geçiş olmaz, her araç ödeme yapar.'),
      traditional: { kind: 'text', text: t('Değişken') },
      visio: { kind: 'text', text: '%100' },
    },
    {
      feature: t('Plaka Tanıma'),
      tip: t('Araç plakalarını otomatik tanıma teknolojisi. Derin öğrenme yapay zekası, kirli, eğik veya hasarlı plakaları bile yüksek doğrulukla okur.'),
      traditional: { kind: 'text', text: t('Karakter Tanıma') },
      visio: { kind: 'text', text: t('Derin Öğrenme Yapay Zeka'), extra: 'ai' },
    },
    {
      feature: t('Mobil Uygulama'),
      tip: t('iOS ve Android cihazlardan otoparkınızı yönetebileceğiniz mobil uygulama. Bildirimleri anında alın, işlemleri telefonunuzdan yapın.'),
      traditional: { kind: 'no' },
      visio: { kind: 'ok', text: t('iOS & Android') },
    },
    {
      feature: t('Veri Güvenliği'),
      tip: t('Verilerinizin güvenli bir şekilde saklanması. Bulut yedekleme ile donanım arızası veya hırsızlık durumunda bile verileriniz korunur.'),
      traditional: { kind: 'text', text: t('Yerel') },
      visio: { kind: 'text', text: t('Bulut Yedekli') },
    },
    {
      feature: t('Teknik Destek'),
      tip: t('Teknik sorunlarda destek alma imkanı. 7/24 kesintisiz destek ile gece gündüz her zaman yardım alabilirsiniz.'),
      traditional: { kind: 'text', text: t('Sınırlı') },
      visio: { kind: 'text', text: t('7/24 Kesintisiz') },
    },
    {
      feature: t('KVKK (GDPR) Uyumlu'),
      tip: t('Görüntülerdeki yüz ve özel veriler bulanıklaştırılır ve kimse tarafından kullanılamaz.'),
      traditional: { kind: 'no' },
      visio: { kind: 'ok' },
    },
    {
      feature: t('Donanım Altyapısı'),
      tip: t('Nvidia Cuda ve ARM mimarisi ile güçlendirilmiş hızlı Plaka Tanıma Sistemi (PTS) ve verimli GPU/CPU performansı.'),
      traditional: { kind: 'text', text: t('Standart CPU') },
      visio: { kind: 'text', text: t('Nvidia CUDA & ARM') },
    },
    {
      feature: t('Otomatik Güncelleme'),
      tip: t('Yazılım güncellemelerinin otomatik olarak yapılması. Yeni özellikler ve güvenlik yamaları uzaktan, kesintisiz olarak uygulanır.'),
      traditional: { kind: 'text', text: t('Manuel') },
      visio: { kind: 'ok', text: t('Uzaktan (Aylık)'), extra: 'auto' },
    },
  ]

  return (
    <>
      <Seo
        title={t('VisioPark vs Geleneksel Sistemler - Karşılaştırma')}
        description={t(
          'VisioPark otopark sistemlerinin geleneksel yazılım ve altyapı ile karşılaştırması. Yerli ve milli, özgür yazılım, ARM işlemci teknolojisi.',
        )}
      />

      <div className={styles.heroGradient} aria-hidden="true" />

      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.liveBadge}>
            <span className={styles.ping} />
            <span className={styles.dot} />
            <span>{t('Her Yerden Canlı Takip')}</span>
          </div>
          <h1>
            {t('Otoparktaymış')}
            <br />
            <span className={styles.gradientText}>{t('Gibi Yönetin')}</span>
          </h1>
          <p>
            <strong>{t('Nerede olursanız olun, otoparkınızı ')}</strong>
            {t('uzaktan izleyin')}.
            <br className={styles.break} />
            <strong>{t('%100 başarılı tahsilat')}</strong> {t('ile gelirinizi maksimize edin.')}
          </p>
        </section>

        <section className={styles.cards}>
          <article className={styles.cardMuted}>
            <div className={styles.iconMuted} aria-hidden="true">
              ▣
            </div>
            <span className={styles.badgeRed}>{t('Kör Noktalar')}</span>
            <h3>{t('Geleneksel Sistemler')}</h3>
            <p>{t('Otoparkta olmazsanız ne olduğunu bilemezsiniz. Kaçak geçişler, kayıp gelirler, kontrol eksikliği.')}</p>
            <ul>
              <li>{t('Uzaktan Erişim Yok')}</li>
              <li>{t('Kaçak Geçiş Riski')}</li>
              <li>{t('Gelir Takibi Zor')}</li>
            </ul>
          </article>

          <article className={styles.cardAccent}>
            <div className={styles.iconAccent} aria-hidden="true">
              ◉
            </div>
            <span className={styles.badgeGreen}>{t('Tam Kontrol')}</span>
            <h3>VisioPark</h3>
            <p>{t('Otoparktaymış gibi her şeyi görün ve yönetin. %100 başarılı tahsilat, sıfır kaçak geçiş.')}</p>
            <ul>
              <li>{t('Canlı Görüntü İzleme')}</li>
              <li>{t('%100 başarılı tahsilat')}</li>
              <li>{t('Pardus & Ubuntu Üzerinde')}</li>
            </ul>
          </article>
        </section>

        <section className={styles.tableSection}>
          <div className={styles.tableIntro}>
            <h2>{t('Detaylı Karşılaştırma')}</h2>
            <p>{t('Özellik bazında farkları keşfedin')}</p>
          </div>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>{t('Özellik')}</th>
                  <th>{t('Geleneksel')}</th>
                  <th>VisioPark</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.feature}>
                    <td>
                      <span title={row.tip}>
                        {row.feature} <em>?</em>
                      </span>
                    </td>
                    <td className={row.traditional.kind === 'no' ? styles.no : undefined}>
                      {row.traditional.kind === 'no' ? '✕' : row.traditional.text}
                    </td>
                    <td className={styles.visioCell}>
                      <VisioValue row={row} t={t} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.mobileCards}>
            <div className={styles.mobileHead}>
              <span>{t('Geleneksel')}</span>
              <span>VisioPark</span>
            </div>
            {rows.map((row) => (
              <article key={row.feature}>
                <header>
                  <h3>{row.feature}</h3>
                  <span title={row.tip}>?</span>
                </header>
                <div className={styles.mobileGrid}>
                  <div className={styles.mobileMuted}>
                    {row.traditional.kind === 'no' ? <span className={styles.no}>✕</span> : row.traditional.text}
                  </div>
                  <div className={styles.mobileVisio}>
                    <VisioValue row={row} t={t} compact />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.cta}>
          <div className={styles.ctaInner}>
            <span className={styles.ctaBadge}>{t('Hemen Başlayın')}</span>
            <h2>{t('Geleceğe Hazır Mısınız?')}</h2>
            <p>
              {t(
                'Yerli ve milli teknoloji ile otopark yönetiminizi modernleştirin. Ücretsiz keşif toplantısı için hemen iletişime geçin.',
              )}
            </p>
            <div className={styles.ctaActions}>
              <Button to={path('discovery.show')}>{t('Ücretsiz Keşif İste')}</Button>
              <a href={path('contact')} className={styles.ctaGhost}>
                {t('Bizi Arayın')}
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

function VisioValue({
  row,
  t,
  compact,
}: {
  row: Row
  t: (key: string) => string
  compact?: boolean
}) {
  return (
    <div className={compact ? styles.visioCompact : undefined}>
      <div>
        {row.visio.kind === 'ok' ? '✓ ' : null}
        {row.visio.text}
      </div>
      {row.visio.extra === 'live' ? (
        <div className={styles.pills}>
          <span>{t('Tailscale VPN güvenli bağlantı')}</span>
          <span>{t('Grafana izleme sistemi')}</span>
        </div>
      ) : null}
      {row.visio.extra === 'ai' ? (
        <p className={styles.aiNote}>{t('Yapay zeka modelimiz her ay otoparkınızdan öğrenir.')}</p>
      ) : null}
      {row.visio.extra === 'auto' ? <span className={styles.autoBadge}>{t('Otomatik')}</span> : null}
    </div>
  )
}
