import Button from '../Button/index.ts'
import KioskScreen from '../KioskZoom/KioskScreen.tsx'
import { RevealGroup, RevealItem } from '../Reveal/index.ts'
import { kioskScreenBox } from '../../data/kioskZoom.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { homeZoneCopy } from './homeZoneCopy.ts'
import PaymentStage from './PaymentStage.tsx'
import PhoneCarousel from './PhoneCarousel.tsx'
import styles from './DriverStrip.module.css'

const copy = homeZoneCopy.driver

/** Kiosk başlığının yakın planı: gerçek kiosk görseli üzerinde DOM ödeme ekranı (net kalır). */
function KioskStage() {
  const { x, y, w, h } = kioskScreenBox
  return (
    <div className={styles.kioskStage} role="img" aria-label={copy.kiosk.screenLabel}>
      <div className={styles.kiosk} aria-hidden="true">
        <picture>
          <source type="image/avif" srcSet="/img/home/kiosk/kiosk-1040.avif 274w, /img/home/kiosk/kiosk-2064.avif 545w" sizes="(min-width: 768px) 19.5rem, 17rem" />
          <img
            className={styles.kioskImage}
            src="/img/home/kiosk/kiosk-2064.webp"
            srcSet="/img/home/kiosk/kiosk-1040.webp 274w, /img/home/kiosk/kiosk-2064.webp 545w"
            sizes="(min-width: 768px) 19.5rem, 17rem"
            alt=""
            width={545}
            height={2064}
            loading="lazy"
            decoding="async"
          />
        </picture>
        <div className={styles.screenBox} style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }}>
          <KioskScreen />
        </div>
      </div>
    </div>
  )
}

/** Zone bölümünün alt şeridi: sürücünün gördüğü kiosk, mobil uygulama ve ödeme kanalları. */
export default function DriverStrip() {
  const path = usePath()

  return (
    <div className={styles.strip}>
      <div className={styles.head}>
        <h3 className={styles.title}>{copy.title}</h3>
        <span className={styles.rule} aria-hidden="true" />
      </div>

      <RevealGroup as="ul" className={styles.cards} stagger={0.1}>
        <RevealItem as="li" className={styles.card}>
          <div className={`${styles.stage} ${styles.kioskCardStage}`}>
            <KioskStage />
          </div>
          <div className={styles.body}>
            <h4 className={styles.cardTitle}>{copy.kiosk.title}</h4>
            <p className={styles.text}>{copy.kiosk.text}</p>
            <p className={styles.meta}>{copy.kiosk.meta}</p>
          </div>
        </RevealItem>

        <RevealItem as="li" className={styles.card}>
          <PhoneCarousel />
        </RevealItem>

        <RevealItem as="li" className={styles.card}>
          <div className={`${styles.stage} ${styles.paymentCardStage}`}>
            <PaymentStage />
          </div>
          <div className={styles.body}>
            <h4 className={styles.cardTitle}>{copy.payment.title}</h4>
            <p className={styles.text}>{copy.payment.text}</p>
          </div>
        </RevealItem>
      </RevealGroup>

      <div className={styles.actions}>
        <Button to={path('software-products')} variant="light" size="lg" arrow>
          {copy.cta}
        </Button>
      </div>
    </div>
  )
}
