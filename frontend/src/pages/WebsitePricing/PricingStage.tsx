import PriceCard from './PriceCard.tsx'
import SiteDiagram from './SiteDiagram.tsx'
import styles from './PricingStage.module.css'

/** Açılış görsel alanı: site kesiti paneli ve panelin alt kenarına binen başlangıç fiyatı kartı. */
export default function PricingStage() {
  return (
    <div className={styles.stage}>
      <div className={styles.panel}>
        <div className={styles.diagram}>
          <SiteDiagram />
        </div>
      </div>
      <div className={styles.cardSlot}>
        <PriceCard />
      </div>
    </div>
  )
}
