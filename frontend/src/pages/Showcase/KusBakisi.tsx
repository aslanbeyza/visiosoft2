import FeatureGrid from '../../components/FeatureGrid/index.ts'
import { CameraIcon, ChartIcon, ReportIcon } from '../../components/FeatureGrid/icons.tsx'
import MediaFrame from '../../components/MediaFrame/index.ts'
import Picture from '../../components/Picture/index.ts'
import ProductZoom from '../../components/ProductZoom/index.ts'
import Prose from '../../components/Prose/index.ts'
import Reveal from '../../components/Reveal/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import ShowcaseLayout from './ShowcaseLayout.tsx'
import { showcaseCopy } from './showcaseCopy.ts'
import { kusBakisiDetails, kusBakisiFeatures, kusBakisiImage, kusBakisiStory, kusBakisiZoom } from './kusBakisiCopy.ts'
import styles from './ShowcaseLayout.module.css'

const icons = { veri: <ChartIcon />, kamera: <CameraIcon />, rapor: <ReportIcon /> }

/** /kus-bakisi-otopark-yonetimi — hero anı: canlı harita ekranında park alanı, kamera ve doluluk paneline yakınlaşma. */
export default function KusBakisi() {
  const path = usePath()
  const copy = showcaseCopy['kus-bakisi']

  return (
    <ShowcaseLayout route="kus-bakisi" relatedTone="surface">
      <div id={copy.jump.id} className={styles.anchor}>
        <ProductZoom
          tone="light"
          maxScale={2}
          eyebrow={kusBakisiZoom.eyebrow}
          title={kusBakisiZoom.title}
          overview={kusBakisiZoom.overview}
          image={kusBakisiImage}
          details={kusBakisiDetails}
          caption={kusBakisiZoom.caption}
        />
      </div>

      <Section tone="surface" spacing="lg" labelledBy={kusBakisiStory.id}>
        <div className={styles.split}>
          <div className={styles.splitCopy}>
            <SectionHeading id={kusBakisiStory.id} eyebrow={kusBakisiStory.eyebrow} title={kusBakisiStory.title} />
            <Reveal delay={0.15} y={20}>
              <Prose size="lg">
                {kusBakisiStory.paragraphs.map((text) => (
                  <p key={text}>{text}</p>
                ))}
              </Prose>
            </Reveal>
          </div>
          {/* Görselin üst kenarında panel başlığı var; screenshot kipi onu kırpmaz. */}
          <MediaFrame className={styles.splitMedia} ratio="1052 / 592" mode="screenshot" caption={kusBakisiStory.caption}>
            <Picture {...kusBakisiStory.image} sizes="(min-width: 1024px) 44vw, 100vw" />
          </MediaFrame>
        </div>
      </Section>

      <Section tone="paper" labelledBy={kusBakisiFeatures.id}>
        <div className={styles.stack}>
          <SectionHeading id={kusBakisiFeatures.id} eyebrow={kusBakisiFeatures.eyebrow} title={kusBakisiFeatures.title} />
          <FeatureGrid
            columns={3}
            label={kusBakisiFeatures.title}
            items={kusBakisiFeatures.items.map((item) => ({
              icon: icons[item.key as keyof typeof icons],
              title: item.title,
              description: item.description,
              to: item.route ? path(item.route) : undefined,
            }))}
          />
        </div>
      </Section>
    </ShowcaseLayout>
  )
}
