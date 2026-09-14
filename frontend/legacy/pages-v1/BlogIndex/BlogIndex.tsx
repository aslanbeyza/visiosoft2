import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../../components/PageHero/index.ts'
import Seo from '../../components/Seo/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { getBlogIndex } from '../../services/index.ts'
import type { BlogPost } from '../../services/index.ts'
import styles from './BlogIndex.module.css'

export default function BlogIndex() {
  const { t } = useLocale()
  const path = usePath()
  const [posts, setPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    getBlogIndex()
      .then((result) => setPosts(result.data || []))
      .catch(() => setPosts([]))
  }, [])

  return (
    <>
      <Seo title={`${t('footer_blog')} - Visiosoft`} />
      <PageHero title={t('footer_blog')} />
      <section className={styles.section}>
        <div className={styles.grid}>
          {posts.map((post) => (
            <Link key={post.slug} to={path('blog.index', post.slug)} className={styles.card}>
              <p>{post.formatted_date}</p>
              <h2>{post.title}</h2>
              <span>{post.excerpt}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
