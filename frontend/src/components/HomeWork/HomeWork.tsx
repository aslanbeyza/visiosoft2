import { Link } from 'react-router-dom'
import Picture from '../Picture/index.ts'
import Section from '../Section/index.ts'
import SectionHeading from '../SectionHeading/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { homeWorkCopy as text } from './homeWorkCopy.ts'
import styles from './HomeWork.module.css'

export default function HomeWork() {
  const path = usePath()

  return (
    <Section id="isler" tone="paper" spacing="lg" labelledBy={text.titleId}>
      <SectionHeading eyebrow={text.eyebrow} title={text.title} id={text.titleId} />

      <ul className={styles.list}>
        {text.items.map((item) => (
          <li key={item.route} className={styles.item}>
            <Link to={path(item.route)} className={styles.card}>
              <span className={styles.visual}>
                <Picture
                  src={item.image.src}
                  avif={item.image.avif}
                  webp={item.image.webp}
                  width={item.image.width}
                  height={item.image.height}
                  alt=""
                  className={styles.image}
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                />
              </span>
              <span className={styles.body}>
                <span className={styles.sector}>{item.sector}</span>
                <h3 className={styles.name}>{item.title}</h3>
                <p className={styles.text}>{item.text}</p>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className={styles.more}>
        <Link to={path('references')} className={styles.moreLink}>
          {text.more}
          <svg viewBox="0 0 24 24" className={styles.arrow} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </p>
    </Section>
  )
}
