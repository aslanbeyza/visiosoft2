import Seo from '../../components/Seo/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { legalPages } from './legalCopy.ts'
import styles from './Legal.module.css'

export default function Legal({ routeName }: { routeName: string }) {
  const { t } = useLocale()
  const page = legalPages[routeName]

  if (!page) return null

  const updated = new Date().toLocaleDateString('tr-TR')

  return (
    <>
      <Seo title={`${page.title} - Visiosoft`} description={page.description} />
      <section className={styles.page}>
        <div className={styles.inner}>
          <h1>{t(page.title) === page.title ? page.title : t(page.title)}</h1>
          {page.updated ? (
            <p className={styles.updated}>
              {t('Son Güncelleme:')} {updated}
            </p>
          ) : null}
          {page.blocks.map((block, index) => {
            if (block.type === 'h2') return <h2 key={index}>{block.text}</h2>
            if (block.type === 'ul') {
              return (
                <ul key={index}>
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )
            }
            if (block.type === 'facts') {
              return (
                <div key={index} className={styles.facts}>
                  {block.items.map((item) => (
                    <p key={item.label}>
                      <strong>{item.label}:</strong> {item.value}
                    </p>
                  ))}
                </div>
              )
            }
            return <p key={index}>{block.text}</p>
          })}
        </div>
      </section>
    </>
  )
}
