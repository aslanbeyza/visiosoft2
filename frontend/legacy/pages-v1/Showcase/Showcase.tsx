import Button from '../../components/Button/index.ts'
import Seo from '../../components/Seo/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { showcaseFor } from './showcaseCopy.ts'
import styles from './Showcase.module.css'

export default function Showcase({ routeName }: { routeName: string }) {
  const path = usePath()
  const copy = showcaseFor(routeName)

  if (!copy) return null

  return (
    <>
      <Seo title={copy.seoTitle} description={copy.seoDescription} />
      <section className={styles.page}>
        <div className={styles.inner}>
          <h1>{copy.title}</h1>
          {copy.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
          <div className={styles.gallery}>
            {copy.images.map((image) => (
              <figure key={image.src}>
                <img src={image.src} alt={image.alt} />
              </figure>
            ))}
          </div>
          <Button to={path(copy.ctaRoute)}>{copy.cta}</Button>
        </div>
      </section>
    </>
  )
}
