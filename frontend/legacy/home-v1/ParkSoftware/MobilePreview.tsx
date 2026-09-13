import { Link } from 'react-router-dom'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { BellIcon, CardIcon, ScanIcon } from './Icons.tsx'
import { parkExtras } from './parkSoftwareCopy.ts'
import styles from './ParkSoftware.module.css'
import StoryCallouts from './StoryCallouts.tsx'
import { useCountUp } from './useCountUp.ts'

export default function MobilePreview() {
  const { t } = useLocale()
  const path = usePath()
  const extra = parkExtras
  const monthly = useCountUp(3000, true)
  const debt = useCountUp(150, true, 1200)
  const name = 'Ahmet Yılmaz'

  const features = [
    { label: extra.plateScan, Icon: ScanIcon },
    { label: extra.instantNotify, Icon: BellIcon },
    { label: extra.easyPay, Icon: CardIcon },
  ]

  return (
    <article className={styles.mobile}>
      <div className={styles.phoneWrap}>
        <StoryCallouts />
        <div className={styles.phone}>
          <div className={styles.screenFill} aria-hidden="true" />
          <div className={styles.screen}>
            <div className={styles.notchPad} aria-hidden="true" />
            <div className={styles.user}>
              <p className={styles.hello}>
                {t('sw_welcome')} {name}
              </p>
              <span className={styles.avatar} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z" />
                </svg>
              </span>
            </div>

            <div className={styles.packageCard}>
              <span className={styles.badge}>{t('sw_active_package')}</span>
              <div className={styles.blobTitle}>{t('sw_monthly_membership')}</div>
              <div className={styles.packagePrice}>
                {Math.round(monthly).toLocaleString('tr-TR')} TL/ay
              </div>
            </div>

            <div className={styles.debtRow}>
              <div>
                <span>{t('sw_debt_payment')}</span>
                <strong>₺{debt.toFixed(2)}</strong>
              </div>
              <span className={styles.payChip}>{extra.pay}</span>
            </div>
          </div>
          <img
            className={styles.phoneFrame}
            src="/assets/images/phone-img.png"
            alt=""
            width={726}
            height={1444}
            draggable={false}
          />
        </div>
      </div>

      <div className={styles.mobileCopy}>
        <p className={styles.mobileLead}>{t('index_mobile_desc_short')}</p>
        <ul className={styles.mobileFeatures}>
          {features.map(({ label, Icon }) => (
            <li key={label}>
              <span className={styles.featureIcon}>
                <Icon />
              </span>
              {label}
            </li>
          ))}
        </ul>
        <Link to={path('software-products')} className={styles.explore}>
          {extra.explore}
        </Link>
      </div>
    </article>
  )
}
