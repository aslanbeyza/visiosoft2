import type { ReactNode } from 'react'
import Button from '../../components/Button/index.ts'
import CardGrid, { LinkCard } from '../../components/CardGrid/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import { EmptyState, ErrorState, Skeleton } from '../../components/States/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import FeaturedPost from './FeaturedPost.tsx'
import { blogCopy as copy } from './blogCopy.ts'
import { coverNote, postCover, postImage, postMeta, readableExcerpt } from './blogMeta.ts'
import type { BlogIndexState } from './useBlogIndex.ts'
import styles from './BlogList.module.css'
import noteStyles from './CoverNote.module.css'

type BlogListProps = { state: BlogIndexState; retry: () => void }

/** Yazı listesi: yükleniyor iskeleti, hata (tekrar dene), boş durum ya da öne çıkan yazı + kart ızgarası. */
export default function BlogList({ state, retry }: BlogListProps) {
  const path = usePath()
  let content: ReactNode

  if (state.status === 'loading') {
    content = (
      <div className={styles.state} data-variant="loading">
        <Skeleton variant="card" count={3} label={copy.loadingList} />
      </div>
    )
  } else if (state.status === 'error') {
    content = (
      <div className={styles.state}>
        <ErrorState title={copy.errorTitle} description={copy.errorBody} retry={retry} />
      </div>
    )
  } else if (state.posts.length === 0) {
    content = (
      <div className={styles.state}>
        <EmptyState
          title={copy.emptyTitle}
          description={copy.emptyBody}
          action={
            <Button to={path('home')} variant="secondary">
              {copy.homeAction}
            </Button>
          }
        />
      </div>
    )
  } else {
    const [first, ...rest] = state.posts
    content = (
      <>
        <FeaturedPost post={first} />
        {rest.length > 0 ? (
          <div className={styles.all}>
            <SectionHeading title={copy.allTitle} id="tum-yazilar" />
            <CardGrid columns={3}>
              {rest.map((post) => {
                const note = coverNote(postCover(post))
                return (
                  <LinkCard
                    key={post.slug}
                    to={path('blog.index', post.slug)}
                    title={post.title}
                    description={readableExcerpt(post.excerpt) || undefined}
                    image={postImage(post)}
                    meta={postMeta(post) || undefined}
                    action={copy.cardAction}
                    className={note ? noteStyles[note] : undefined}
                  />
                )
              })}
            </CardGrid>
          </div>
        ) : null}
      </>
    )
  }

  return (
    <Section tone="surface" spacing="lg" width="wide" label={copy.allTitle}>
      {content}
    </Section>
  )
}
