import CheckList from '../../components/CheckList/index.ts'
import MediaFrame from '../../components/MediaFrame/index.ts'
import Picture from '../../components/Picture/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import { titleIds, violationsCopy } from './violationsCopy.ts'
import styles from './ViolationAudit.module.css'

const copy = violationsCopy.audit

/** Denetim bölümü: başlık ve kazanımlar (çizilen onay işaretleri) + açılan, kayan kapalı otopark fotoğrafı. */
export default function ViolationAudit() {
  return (
    <div className={styles.grid}>
      <div className={styles.copy}>
        <SectionHeading id={titleIds.audit} eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead} />
        <CheckList items={copy.checks} className={styles.checks} />
      </div>
      <MediaFrame className={styles.media} ratio="3 / 2" parallax={5} chips={[{ label: copy.chip, tone: 'neutral' }]}>
        <Picture
          src="/img/pages/otopark-960.webp"
          webp="/img/pages/otopark-960.webp 960w, /img/pages/otopark-1600.webp 1600w"
          avif="/img/pages/otopark-960.avif 960w, /img/pages/otopark-1600.avif 1600w"
          sizes="(min-width: 1280px) 42rem, (min-width: 1024px) 52vw, 100vw"
          width={1600}
          height={1066}
          alt={copy.alt}
        />
      </MediaFrame>
    </div>
  )
}
