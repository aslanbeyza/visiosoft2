import { useSearchParams } from 'react-router-dom'
import Button from '../../components/Button/index.ts'
import PageHero from '../../components/PageHero/index.ts'
import Reveal from '../../components/Reveal/index.ts'
import Section from '../../components/Section/index.ts'
import Seo from '../../components/Seo/index.ts'
import { EmptyState, ErrorState, Skeleton } from '../../components/States/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { API_URL } from '../../services/index.ts'
import ManualBody from './ManualBody.tsx'
import ManualChapters from './ManualChapters.tsx'
import { fieldManualCopy as copy } from './fieldManualCopy.ts'
import { toChapters } from './manualChapters.ts'
import { useFieldManual } from './useFieldManual.ts'
import styles from './FieldManualPage.module.css'

const PDF_HREF = `${API_URL}/api/manuals/field-user-manual/pdf?locale=tr`

/**
 * /saha-kullanim-kilavuzu — bölünmüş hero (başlık, künye, PDF/Yazdır; sağda çizilen cilt sırtı = bölüm listesi) →
 * kılavuz metni (içindekiler, teknik özellik tablosu) → destek satırı. `?pdf=1` (sunucu PDF'i) hareketsiz ve eylemsiz çizer.
 */
export default function FieldManualPage() {
  const path = usePath()
  const [params] = useSearchParams()
  const pdfMode = params.get('pdf') === '1'
  const { state, retry } = useFieldManual()
  const manual = state.status === 'ready' ? state.manual : null
  const hasContent = Boolean(manual && ((manual.sections?.length ?? 0) > 0 || manual.overview))

  // Künye alanı yalnızca veri beklenirken yer ayırır; hata durumunda başlıkla eylemler arasında boşluk bırakmaz.
  const meta = state.status === 'error' ? undefined : (
    <div className={styles.metaSlot} data-pending={state.status === 'loading'}>
      {manual && (manual.version || manual.publish_date) ? (
        <dl>
          {manual.version ? (
            <div>
              <dt>{manual.version_label || copy.versionLabel}</dt>
              <dd>{manual.version}</dd>
            </div>
          ) : null}
          {manual.publish_date ? (
            <div>
              <dt>{manual.publish_date_label || copy.dateLabel}</dt>
              <dd>{manual.publish_date}</dd>
            </div>
          ) : null}
        </dl>
      ) : null}
    </div>
  )

  // Yazdır/PDF yalnızca kılavuz içeriği varken anlamlıdır.
  const actions = pdfMode || !manual ? undefined : (
    <>
      {manual?.pdf_filename ? (
        <Button href={PDF_HREF} external arrow>
          {manual.download_pdf_button || copy.pdf}
        </Button>
      ) : null}
      <Button type="button" variant="secondary" onClick={() => window.print()}>
        {manual?.print_button || copy.print}
      </Button>
    </>
  )

  // Hata durumunda hero ikinci bir hata kutusu göstermez: ortalanmış başlık kalır, açıklamayı aşağıdaki tek ErrorState yapar.
  const failed = state.status === 'error'
  const chapters = failed ? undefined : (
    <ManualChapters chapters={manual ? toChapters(manual) : null} title={manual?.toc_title} static={pdfMode} />
  )

  return (
    <>
      <Seo title={copy.seoTitle} description={copy.seoDescription} noindex={pdfMode} />
      {pdfMode ? (
        <header className={styles.pdfHeader}>
          <p className={styles.pdfEyebrow}>{copy.eyebrow}</p>
          <h1 className={styles.pdfTitle}>{copy.title}</h1>
          <p className={styles.pdfLead}>{manual?.subtitle || copy.lead}</p>
          {meta}
        </header>
      ) : (
        <PageHero
          variant={failed ? 'centered' : 'split'}
          tone="surface"
          eyebrow={copy.eyebrow}
          title={copy.title}
          lead={copy.lead}
          aside={meta}
          actions={actions}
          media={chapters}
          mediaOrder="last"
        />
      )}

      {state.status === 'loading' ? (
        <Section tone="paper" spacing="lg" width="prose">
          <Skeleton variant="article" count={5} label={copy.loading} />
        </Section>
      ) : null}

      {state.status === 'error' ? (
        <Section tone="paper" spacing="lg" width="prose">
          <ErrorState title={copy.errorTitle} description={copy.errorBody} retry={retry} />
        </Section>
      ) : null}

      {manual && !hasContent ? (
        <Section tone="paper" spacing="lg" width="prose">
          <EmptyState
            title={copy.emptyTitle}
            description={copy.emptyBody}
            action={
              <Button to={path('contact')} variant="secondary">
                {copy.supportAction}
              </Button>
            }
          />
        </Section>
      ) : null}

      {manual && hasContent ? <ManualBody manual={manual} isStatic={pdfMode} /> : null}

      {pdfMode ? null : (
        <Section tone="surface" spacing="md" width="content">
          <Reveal className={styles.support} y={16} amount={0.4}>
            <div className={styles.supportCopy}>
              <p className={styles.supportTitle}>{copy.supportTitle}</p>
              <p className={styles.supportBody}>{copy.supportBody}</p>
            </div>
            <Button to={path('contact')} arrow>
              {copy.supportAction}
            </Button>
          </Reveal>
        </Section>
      )}
    </>
  )
}
