import { useId } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import MediaFrame from '../../components/MediaFrame/index.ts'
import Reveal, { revealEase } from '../../components/Reveal/index.ts'
import TextReveal from '../../components/TextReveal/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import type { BlogPost } from '../../services/index.ts'
import { blogCopy as copy } from './blogCopy.ts'
import { coverCaption, postCover, postMeta, readableExcerpt } from './blogMeta.ts'
import styles from './FeaturedPost.module.css'

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" className={styles.arrow} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

/**
 * Listenin başındaki "son yazı" kartı: görsel üstten aşağı açılır (MediaFrame), başlık satır satır yükselir,
 * etiket çizgisi çizilir. Kartın tamamı yazıya bağlantıdır.
 */
export default function FeaturedPost({ post }: { post: BlogPost }) {
  const path = usePath()
  const reduce = Boolean(useReducedMotion())
  const titleId = useId()
  const meta = postMeta(post)
  const excerpt = readableExcerpt(post.excerpt)
  const cover = postCover(post)

  return (
    <article className={styles.featured} data-image={Boolean(cover)} aria-labelledby={titleId}>
      {cover ? (
        <div className={styles.media}>
          <MediaFrame ratio="16 / 10" parallax={3} radius="md" caption={coverCaption(cover)}>
            <img src={cover} alt="" width={1600} height={1000} decoding="async" />
          </MediaFrame>
        </div>
      ) : null}

      <div className={styles.copy}>
        <Reveal as="p" className={styles.eyebrow} y={12} amount={0.2}>
          <motion.span
            className={styles.rule}
            aria-hidden="true"
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2, ease: revealEase }}
          />
          {copy.featuredEyebrow}
        </Reveal>

        <h2 id={titleId} className={styles.title}>
          <Link to={path('blog.index', post.slug)} className={styles.link}>
            <TextReveal as="span" text={post.title} delay={0.1} />
          </Link>
        </h2>

        {excerpt ? (
          <Reveal as="p" className={styles.excerpt} delay={0.3} y={16} amount={0.2}>
            {excerpt}
          </Reveal>
        ) : null}

        <Reveal className={styles.footer} delay={0.4} y={12} amount={0.2}>
          {meta ? <span className={styles.meta}>{meta}</span> : null}
          <span className={styles.action} aria-hidden="true">
            {copy.read}
            <Arrow />
          </span>
        </Reveal>
      </div>
    </article>
  )
}
