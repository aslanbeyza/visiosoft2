import { useRef } from 'react'
import { useParams } from 'react-router-dom'
import Button from '../../components/Button/index.ts'
import CardGrid, { LinkCard } from '../../components/CardGrid/index.ts'
import CtaBand from '../../components/CtaBand/index.ts'
import JsonLd from '../../components/JsonLd/index.ts'
import Prose from '../../components/Prose/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import Seo, { SITE_URL } from '../../components/Seo/index.ts'
import { EmptyState, ErrorState, Skeleton } from '../../components/States/index.ts'
import { company } from '../../data/company.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { blogCopy as copy } from '../BlogIndex/blogCopy.ts'
import { coverNote, postCover, postImage, postMeta, readableExcerpt } from '../BlogIndex/blogMeta.ts'
import noteStyles from '../BlogIndex/CoverNote.module.css'
import ArticleHeader from './ArticleHeader.tsx'
import { normalizeContent, tocDepthFor } from './normalizeContent.ts'
import ReadingProgress from './ReadingProgress.tsx'
import { useBlogPost } from './useBlogPost.ts'
import styles from './BlogShowPage.module.css'

/**
 * /blog/:slug — okuma çizgisi + yazı başlığı (h1 satır satır, görsel açılır) → temizlenmiş HTML ve içindekiler →
 * ilgili yazılar → CtaBand. Yükleniyor iskeleti, bulunamadı (404) ve hata (tekrar dene) durumları ayrıdır.
 */
export default function BlogShowPage() {
  const { slug = '' } = useParams()
  const path = usePath()
  const { state, retry } = useBlogPost(slug)
  const articleRef = useRef<HTMLElement>(null)

  if (state.status !== 'ready') {
    const missing = state.status === 'missing'
    const heading = state.status === 'loading' ? copy.loadingPost : missing ? copy.missingTitle : copy.postErrorTitle
    const back = (
      <Button to={path('blog.index')} variant="secondary">
        {copy.back}
      </Button>
    )
    return (
      <>
        <Seo title={missing ? `${copy.missingTitle} - Visiosoft` : copy.seoTitle} noindex={missing} />
        <div className={styles.shell}>
          <h1 className={styles.srOnly}>{heading}</h1>
          {state.status === 'loading' ? <Skeleton variant="article" count={4} label={copy.loadingPost} /> : null}
          {missing ? <EmptyState title={copy.missingTitle} description={copy.missingBody} action={back} /> : null}
          {state.status === 'error' ? (
            <ErrorState title={copy.postErrorTitle} description={copy.errorBody} retry={retry} />
          ) : null}
        </div>
      </>
    )
  }

  const { post } = state
  const content = normalizeContent(post.content || '')
  // Ara başlık varken geniş iki sütunlu düzen; yoksa metin başlıkla aynı ortalanmış tek sütunda akar.
  const layout = tocDepthFor(content) ? 'toc' : 'single'
  const related = Array.isArray(post.related) ? post.related : []
  const canonical = path('blog.index', post.slug)
  const cover = postCover(post)

  return (
    <>
      <Seo title={`${post.title} - Visiosoft`} description={readableExcerpt(post.excerpt)} ogImage={cover} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: readableExcerpt(post.excerpt),
          image: cover ? `${SITE_URL}${cover}` : undefined,
          mainEntityOfPage: `${SITE_URL}${canonical}`,
          publisher: { '@type': 'Organization', name: company.legalName },
        }}
      />
      <article ref={articleRef} className={styles.article}>
        <ReadingProgress target={articleRef} />
        <ArticleHeader post={post} cover={cover} layout={layout} />
        <Section tone="paper" spacing="md" width="content">
          <div className={styles.body} data-layout={layout}>
            {/* Prose içindekileri h2'lerden, h2 yoksa h3'lerden üretir; başlık yoksa tek sütun kalır. */}
            <Prose html={content} toc tocLabel={copy.toc} size="lg" />
          </div>
        </Section>
      </article>

      {related.length > 0 ? (
        <Section tone="surface" spacing="lg" width="wide" labelledBy="ilgili-yazilar">
          <div className={styles.related}>
            <SectionHeading eyebrow={copy.relatedEyebrow} title={copy.related} id="ilgili-yazilar" />
            <CardGrid columns={3}>
              {related.map((item) => {
                const note = coverNote(postCover(item))
                return (
                  <LinkCard
                    key={item.slug}
                    to={path('blog.index', item.slug)}
                    title={item.title}
                    description={readableExcerpt(item.excerpt) || undefined}
                    image={postImage(item)}
                    meta={postMeta(item) || undefined}
                    action={copy.cardAction}
                    className={note ? noteStyles[note] : undefined}
                  />
                )
              })}
            </CardGrid>
          </div>
        </Section>
      ) : null}

      <CtaBand
        eyebrow={copy.cta.eyebrow}
        title={copy.cta.title}
        description={copy.cta.description}
        primary={{ label: copy.cta.primary, to: path('contact') }}
        secondary={{ label: copy.cta.secondary, to: path('quote.index') }}
      />
    </>
  )
}
