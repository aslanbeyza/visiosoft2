import { Link } from 'react-router-dom'
import MediaFrame from '../../components/MediaFrame/index.ts'
import Reveal from '../../components/Reveal/index.ts'
import TextReveal from '../../components/TextReveal/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { blogCopy as copy } from '../BlogIndex/blogCopy.ts'
import { coverCaption, excerptRepeatsContent, readableExcerpt } from '../BlogIndex/blogMeta.ts'
import type { BlogPostDetail } from './useBlogPost.ts'
import styles from './ArticleHeader.module.css'

function BackArrow() {
  return (
    <svg viewBox="0 0 24 24" className={styles.backIcon} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  )
}

type ArticleHeaderProps = {
  post: BlogPostDetail

  cover?: string

  layout: 'toc' | 'single'
}

export default function ArticleHeader({ post, cover, layout }: ArticleHeaderProps) {
  const path = usePath()
  const hasMeta = Boolean(post.formatted_date || post.reading_minutes)

  const excerpt = excerptRepeatsContent(post.excerpt, post.content) ? '' : readableExcerpt(post.excerpt)

  return (
    <header className={styles.header} data-layout={layout}>
      <div className={styles.inner}>
        <Reveal y={10} amount={0.1}>
          <Link to={path('blog.index')} className={styles.back}>
            <BackArrow />
            {copy.back}
          </Link>
        </Reveal>

        {hasMeta ? (
          <Reveal as="p" className={styles.meta} delay={0.08} y={12} amount={0.1}>
            {post.formatted_date ? <span>{post.formatted_date}</span> : null}
            {post.formatted_date && post.reading_minutes ? <span className={styles.dot} aria-hidden="true" /> : null}
            {post.reading_minutes ? <span>{copy.readingTime(post.reading_minutes)}</span> : null}
          </Reveal>
        ) : null}

        <TextReveal as="h1" text={post.title} className={styles.title} delay={0.15} />

        {excerpt ? (
          <Reveal as="p" className={styles.lead} delay={0.45} y={18} amount={0.1}>
            {excerpt}
          </Reveal>
        ) : null}
      </div>

      {cover ? (
        <div className={styles.media}>
          <MediaFrame ratio="16 / 9" parallax={4} caption={coverCaption(cover)}>
            <img src={cover} alt="" width={1600} height={900} fetchPriority="high" decoding="async" />
          </MediaFrame>
        </div>
      ) : null}
    </header>
  )
}
