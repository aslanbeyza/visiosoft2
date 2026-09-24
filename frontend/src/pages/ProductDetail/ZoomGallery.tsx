import { useId } from 'react'
import MediaFrame from '../../components/MediaFrame/index.ts'
import Picture from '../../components/Picture/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import type { DetailZoom } from './detailTypes.ts'
import styles from './ZoomGallery.module.css'

type ZoomGalleryProps = {
  zoom: Extract<DetailZoom, { kind: 'gallery' }>
}

export default function ZoomGallery({ zoom }: ZoomGalleryProps) {
  const titleId = useId()

  return (
    <Section tone="surface" spacing="lg" labelledBy={titleId}>
      <SectionHeading eyebrow={zoom.eyebrow} title={zoom.title} lead={zoom.lead} id={titleId} />
      <ul className={styles.grid}>
        {zoom.items.map((item, index) => (
          <li key={item.id} className={styles.item} data-index={index}>
            {}
            <MediaFrame
              ratio="4 / 3"
              fit={item.fit}
              parallax={2}
              caption={item.caption}
              className={styles.frame}
            >
              <Picture
                src={item.image.src}
                avif={item.image.avif}
                alt={item.image.alt}
                width={item.image.width}
                height={item.image.height}
                className={item.fit === 'contain' ? styles.contain : undefined}
              />
            </MediaFrame>
          </li>
        ))}
      </ul>
    </Section>
  )
}
