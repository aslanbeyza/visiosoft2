import Seo from '../../components/Seo/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import styles from './EndToEnd.module.css'

const leftModules = [
  { title: 'Çağrı Merkezi', desc: 'Uzak İstasyon Yönetimi', mark: 'CM' },
  { title: 'Otopark Yönetimi', desc: 'Uzak Otopark Yönetimi', mark: 'OY' },
  { title: 'Visio Kart', desc: 'Kart Yetkilendirme ve Yönetim', mark: 'VK' },
] as const

const rightModules = [
  { title: 'Fatura Yönetimi', desc: 'Fiyat ve Fatura Yönetimi', mark: 'FY' },
  { title: 'Abone Yönetimi', desc: 'Kullanıcı ve Abone Yönetimi', mark: 'AY' },
  { title: 'Visio Portal', desc: 'EPDK & GIB Entegrasyonu', mark: 'VP' },
] as const

const reasons = [
  {
    title: 'Her hava koşulunda tanıma',
    desc: 'Zorlu ışık ve hava koşullarında bile kesintisiz araç tanıma ve geçiş kontrolü sağlar.',
    tone: 'blue',
  },
  {
    title: 'Merkezi operasyon paneli',
    desc: 'Tüm sahaları, kullanıcı akışlarını ve gelir süreçlerini tek ekrandan yönetebilirsiniz.',
    tone: 'purple',
  },
  {
    title: 'EPDK/GİB uyumlu altyapı',
    desc: 'EPDK ve GİB entegrasyonlarıyla mevzuata uyumlu, sürdürülebilir bir operasyon sunar.',
    tone: 'orange',
  },
] as const

export default function EndToEnd() {
  const { t } = useLocale()

  return (
    <>
      <Seo
        title={t('Uçtan Uca Otopark Sistemi - Visiosoft')}
        description={t(
          'VISIO ile uçtan uca otopark ve şarj otomasyonu. Çağrı merkezi, otopark yönetimi, fatura ve abone yönetimi tek platformda.',
        )}
      />

      <section className={styles.page}>
        <div className={styles.wrap}>
          <div className={styles.hub}>
            <div className={styles.col}>
              {leftModules.map((item) => (
                <article key={item.title} className={`${styles.module} ${styles.left}`}>
                  <div>
                    <h3>{t(item.title)}</h3>
                    <p>{t(item.desc)}</p>
                  </div>
                  <span>{item.mark}</span>
                </article>
              ))}
            </div>

            <div className={styles.circleWrap}>
              <div className={styles.circle}>
                <p>{t('HEPSİ BİR ARADA')}</p>
                <strong>VISIO</strong>
                <span>{t('Otopark ve Şarj Otomasyonu')}</span>
              </div>
            </div>

            <div className={styles.col}>
              {rightModules.map((item) => (
                <article key={item.title} className={styles.module}>
                  <span>{item.mark}</span>
                  <div>
                    <h3>{t(item.title)}</h3>
                    <p>{t(item.desc)}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className={styles.why}>
            <h2>{t('Neden Visiosoft?')}</h2>
            <div className={styles.reasons}>
              {reasons.map((item) => (
                <article key={item.title}>
                  <span className={styles[item.tone]} />
                  <h3>{t(item.title)}</h3>
                  <p>{t(item.desc)}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
