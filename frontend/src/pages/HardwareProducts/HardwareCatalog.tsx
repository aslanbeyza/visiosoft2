import { useEffect } from 'react'
import Button from '../../components/Button/index.ts'
import CtaBand from '../../components/CtaBand/index.ts'
import PageHero from '../../components/PageHero/index.ts'
import Seo from '../../components/Seo/index.ts'
import SubNav from '../../components/SubNav/index.ts'
import { company } from '../../data/company.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import CatalogSheet from './CatalogSheet.tsx'
import { catalogCopy, catalogSeo } from './catalogCopy.ts'
import { categoryLabel, hardwareItems } from './data.ts'
import { ctaCopy } from './listingCopy.ts'
import styles from './HardwareCatalog.module.css'

const pad = (value: number) => String(value).padStart(2, '0')

function PrintIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M7 9V3h10v6M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />
      <path d="M7 14h10v7H7z" />
    </svg>
  )
}

/** /donanim-urunleri/katalog: ekranda belge görünümü, baskıda kapak + ürün başına bir A4 sayfası. */
export default function HardwareCatalog() {
  const path = usePath()
  const print = () => window.print()
  const subNavItems = hardwareItems.map((item) => ({ id: `katalog-${item.slug}`, label: item.navLabel }))

  // Baskıda site iskeletini (navbar, footer, WhatsApp) gizleyen işaret; sayfadan çıkınca kaldırılır.
  useEffect(() => {
    document.body.dataset.printMode = 'catalog'
    return () => {
      delete document.body.dataset.printMode
    }
  }, [])

  return (
    <>
      <Seo title={catalogSeo.title} description={catalogSeo.description} />

      <PageHero
        variant="centered"
        className={styles.screenOnly}
        breadcrumbs={[
          { label: catalogCopy.breadcrumbHome, to: path('home') },
          { label: catalogCopy.breadcrumbHardware, to: path('hardware-products') },
          { label: catalogCopy.breadcrumbCatalog },
        ]}
        eyebrow={catalogCopy.eyebrow}
        title={catalogCopy.title}
        lead={catalogCopy.lead}
        actions={
          <>
            <Button type="button" size="lg" onClick={print}>
              <PrintIcon />
              {catalogCopy.print}
            </Button>
            <Button to={path('hardware-products')} variant="secondary" size="lg">
              {catalogCopy.back}
            </Button>
          </>
        }
      />

      <SubNav
        items={subNavItems}
        label={catalogCopy.subNavLabel}
        className={styles.screenOnly}
        extra={
          <button type="button" className={styles.barPrint} onClick={print}>
            <PrintIcon />
            {catalogCopy.print}
          </button>
        }
      />

      <div className={styles.document}>
        {/* Yalnızca baskıda görünen kapak sayfası. */}
        <div className={styles.cover} aria-hidden="true">
          <p className={styles.coverBrand}>{company.legalName}</p>
          <p className={styles.coverTitle}>{catalogCopy.documentTitle}</p>
          <p className={styles.coverLead}>{catalogCopy.lead}</p>
          <ol className={styles.coverToc}>
            {hardwareItems.map((item, index) => (
              <li key={item.slug}>
                <span className={styles.coverIndex}>{pad(index + 1)}</span>
                <span>{item.name}</span>
                <span className={styles.coverCategory}>{categoryLabel(item.category)}</span>
              </li>
            ))}
          </ol>
          <p className={styles.coverContact}>
            {company.email} · visiosoft.com.tr
          </p>
        </div>

        <p className={styles.hint}>{catalogCopy.hint}</p>

        <div className={styles.sheets}>
          {hardwareItems.map((item, index) => (
            <CatalogSheet key={item.slug} item={item} page={index + 1} total={hardwareItems.length} />
          ))}
        </div>
      </div>

      <div className={styles.screenOnly}>
        <CtaBand
          eyebrow={ctaCopy.eyebrow}
          title={ctaCopy.title}
          description={ctaCopy.description}
          primary={{ label: ctaCopy.primary, to: path('discovery.show') }}
          secondary={{ label: ctaCopy.secondary, to: path('quote.index') }}
        />
      </div>
    </>
  )
}
