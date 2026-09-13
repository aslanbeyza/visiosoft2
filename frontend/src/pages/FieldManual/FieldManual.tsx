import { useEffect, useState } from 'react'
import PageHero from '../../components/PageHero/index.ts'
import Seo from '../../components/Seo/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { getFieldManual } from '../../services/index.ts'
import type { ManualSection } from '../../services/index.ts'
import styles from './FieldManual.module.css'

export default function FieldManual() {
  const { t } = useLocale()
  const [title, setTitle] = useState(t('footer_field_manual'))
  const [sections, setSections] = useState<ManualSection[]>([])

  useEffect(() => {
    getFieldManual()
      .then((result) => {
        setTitle(result.data.title || t('footer_field_manual'))
        setSections(result.data.sections || [])
      })
      .catch(() => setSections([]))
  }, [t])

  return (
    <>
      <Seo title={`${title} - Visiosoft`} />
      <PageHero title={title} />
      <section className={styles.section}>
        {sections.map((section, index) => (
          <article key={`${section.title}-${index}`} className={styles.card}>
            {section.title ? <h2>{section.title}</h2> : null}
            {section.body ? <p>{section.body}</p> : null}
          </article>
        ))}
      </section>
    </>
  )
}
