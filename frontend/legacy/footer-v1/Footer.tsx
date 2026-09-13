import { Link } from 'react-router-dom'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import styles from './Footer.module.css'

type FooterLink = { route: string; label: string; hash?: string }
type FooterColumn = { title: string; links: FooterLink[] }

const columns: FooterColumn[] = [
  {
    title: 'footer_products',
    links: [
      { route: 'software-products', label: 'footer_park_software' },
      { route: 'hardware-products', label: 'footer_hardware' },
    ],
  },
  {
    title: 'footer_developers',
    links: [
      { route: 'developers', label: 'footer_developers_link' },
      { route: 'software-products', label: 'footer_software_products' },
      { route: 'developers', label: 'footer_gate_sdk', hash: '#gate-sdk' },
      { route: 'developers', label: 'footer_zone_api', hash: '#zone-api' },
    ],
  },
  {
    title: 'footer_main_solutions',
    links: [
      { route: 'plate-recognition-system', label: 'footer_lpr_system' },
      { route: 'parking-software', label: 'footer_parking_software' },
      { route: 'alpr.index', label: 'footer_lpr' },
      { route: 'end-to-end', label: 'footer_end_to_end_system' },
      { route: 'on-street', label: 'footer_on_street_parking' },
      { route: 'parking-violations', label: 'footer_parking_violations' },
    ],
  },
  {
    title: 'footer_features',
    links: [
      { route: 'hgs', label: 'footer_hgs_payment' },
      { route: 'kus-bakisi', label: 'footer_birds_eye_management' },
      { route: 'parking-reports', label: 'footer_reports' },
      { route: 'low-confidence', label: 'footer_hgs_confirmation' },
      { route: 'mobil-abonelik', label: 'footer_mobile_subscription' },
      { route: 'designer-tool', label: 'footer_designer_tool' },
      { route: 'services', label: 'footer_services' },
    ],
  },
  {
    title: 'footer_corporate',
    links: [
      { route: 'references', label: 'footer_references' },
      { route: 'team', label: 'footer_team' },
      { route: 'blog.index', label: 'footer_blog' },
      { route: 'comparison', label: 'footer_comparison' },
      { route: 'contact', label: 'footer_contact' },
    ],
  },
  {
    title: 'footer_other',
    links: [
      { route: 'quote.index', label: 'footer_get_quote' },
      { route: 'website-pricing', label: 'Site Otopark Yönetimi' },
      { route: 'discovery.show', label: 'footer_free_consultation' },
      { route: 'bank-accounts', label: 'footer_bank_accounts' },
      { route: 'field-manual', label: 'footer_field_manual' },
      { route: 'legal.privacy', label: 'footer_privacy_policy' },
      { route: 'legal.distance-sales', label: 'footer_distance_sales_agreement' },
      { route: 'legal.return-policy', label: 'footer_return_policy' },
      { route: 'sitemap', label: 'footer_sitemap' },
    ],
  },
]

export default function Footer() {
  const { t, config } = useLocale()
  const path = usePath()
  const whatsapp = config?.whatsapp_wa_id || '905015045034'
  const display = config?.whatsapp_display || '+90 (501) 504 5034'

  return (
    <footer className={`footer ${styles.footer}`}>
      <div className={styles.inner}>
        <div className={styles.mobile}>
          {columns.map((column) => (
            <details key={column.title} className={styles.details}>
              <summary>{t(column.title)}</summary>
              <ul>
                {column.links.map((link) => (
                  <li key={`${link.route}-${link.label}`}>
                    <Link to={`${path(link.route)}${link.hash || ''}`}>{t(link.label)}</Link>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>

        <div className={styles.grid}>
          {columns.map((column) => (
            <div key={column.title}>
              <h3>{t(column.title)}</h3>
              <ul>
                {column.links.map((link) => (
                  <li key={`${link.route}-${link.label}`}>
                    <Link to={`${path(link.route)}${link.hash || ''}`}>{t(link.label)}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.bottom}>
          <p>
            {t('footer_more_info')}{' '}
            <Link to={path('contact')} className={styles.primary}>
              {t('footer_contact_us')}
            </Link>{' '}
            {t('footer_or_call')}{' '}
            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className={styles.primary}>
              {display}
            </a>
            .
          </p>
          <div className={styles.meta}>
            <div>
              <p>© {new Date().getFullYear()} {t('footer_copyright')}</p>
              <img
                className={styles.badges}
                src="/img/footer-compliance-logos.svg"
                alt={t('footer_compliance_alt')}
                width="176"
                height="45"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
