import { useLocale } from '../../hooks/useLocale/index.ts'
import { BellIcon } from './Icons.tsx'
import { parkExtras } from './parkSoftwareCopy.ts'
import styles from './ParkSoftware.module.css'

export default function StoryCallouts() {
  const { t } = useLocale()
  const extra = parkExtras

  return (
    <div className={styles.floats} aria-hidden="true">
      <aside className={`${styles.float} ${styles.floatPackage}`}>
        <p className={styles.floatTitle}>{t('sw_active_package')}</p>
        <p className={styles.floatCopy}>{t('sw_monthly_membership')}</p>
      </aside>
      <aside className={`${styles.float} ${styles.floatDebt}`}>
        <p className={styles.floatTitle}>{t('sw_debt_payment')}</p>
        <p className={styles.floatCopy}>{t('index_remote_payment_control')}</p>
      </aside>
      <aside className={`${styles.float} ${styles.floatMini} ${styles.floatNotify}`}>
        <BellIcon className={styles.floatIcon} />
        <p className={styles.floatTitle}>{extra.notify}</p>
      </aside>
    </div>
  )
}
