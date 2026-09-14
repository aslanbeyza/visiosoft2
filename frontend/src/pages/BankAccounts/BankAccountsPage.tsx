import { Link } from 'react-router-dom'
import Button from '../../components/Button/index.ts'
import PageHero from '../../components/PageHero/index.ts'
import Reveal from '../../components/Reveal/index.ts'
import Section from '../../components/Section/index.ts'
import Seo from '../../components/Seo/index.ts'
import { company, whatsappUrl } from '../../data/company.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import BankCard from './BankCard.tsx'
import BankHeroCards from './BankHeroCards.tsx'
import { bankAccountsCopy as copy } from './bankAccountsCopy.ts'
import styles from './BankAccountsPage.module.css'

export default function BankAccountsPage() {
  const path = usePath()
  const { config } = useLocale()
  const waId = config?.whatsapp_wa_id || company.whatsapp.waId

  return (
    <>
      <Seo title={copy.seoTitle} description={copy.seoDescription} />

      <PageHero
        variant="split"
        breadcrumbs={[
          { label: copy.breadcrumbs.home, to: path('home') },
          { label: copy.breadcrumbs.contact, to: path('contact') },
          { label: copy.breadcrumbs.current },
        ]}
        eyebrow={copy.eyebrow}
        title={copy.title}
        lead={copy.lead}
        media={<BankHeroCards banks={copy.banks} />}
        mediaOrder="last"
      />

      <Section tone="surface" spacing="lg" label={copy.listLabel}>
        <div className={styles.grid}>
          {copy.banks.map((bank, index) => (
            <BankCard key={bank.code} bank={bank} index={index} />
          ))}
        </div>
        <Reveal as="p" className={styles.hint} delay={0.2} y={12}>
          <svg viewBox="0 0 24 24" className={styles.hintIcon} aria-hidden="true" focusable="false">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5M12 8h.01" />
          </svg>
          {copy.hint}
        </Reveal>
      </Section>

      <Section tone="paper" spacing="md" labelledBy="odeme-yardim-baslik">
        <Reveal className={styles.help} y={24}>
          <div className={styles.helpCopy}>
            <h2 id="odeme-yardim-baslik" className={styles.helpTitle}>
              {copy.help.title}
            </h2>
            <p className={styles.helpText}>{copy.help.text}</p>
          </div>
          <div className={styles.helpActions}>
            <Button href={`mailto:${company.email}`} arrow>
              {copy.help.email}
            </Button>
            <Button href={whatsappUrl(waId)} variant="secondary" external>
              {copy.help.whatsapp}
            </Button>
            <Link to={`${path('contact')}#sirket-bilgileri`} className={styles.helpLink}>
              {copy.help.contact}
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  )
}
