import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Seo from '../../components/Seo/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { getBlogPost } from '../../services/index.ts'
import type { BlogPost } from '../../services/index.ts'
import styles from './BlogShow.module.css'

type Post = BlogPost & { content?: string; related?: BlogPost[] }

export default function BlogShow() {
  const { slug = '' } = useParams()
  const path = usePath()
  const [post, setPost] = useState<Post | null>(null)

  useEffect(() => {
    getBlogPost(slug)
      .then((result) => setPost(result.data))
      .catch(() => setPost(null))
  }, [slug])

  if (!post) {
    return <section className={styles.article}>Yazı yükleniyor...</section>
  }

  return (
    <article className={styles.article}>
      <Seo title={`${post.title} - Visiosoft`} description={post.excerpt} />
      <p>{post.formatted_date}</p>
      <h1>{post.title}</h1>
      <div className={styles.content} dangerouslySetInnerHTML={{ __html: post.content || '' }} />
      <div className={styles.related}>
        {(post.related || []).map((item) => (
          <Link key={item.slug} to={path('blog.index', item.slug)}>
            {item.title}
          </Link>
        ))}
      </div>
    </article>
  )
}
