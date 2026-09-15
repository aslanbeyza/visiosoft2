import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import Button from '../../components/Button/index.ts'
import CtaBand from '../../components/CtaBand/index.ts'
import Magnetic from '../../components/Magnetic/index.ts'
import MediaFrame from '../../components/MediaFrame/index.ts'
import PageHero from '../../components/PageHero/index.ts'
import Picture from '../../components/Picture/index.ts'
import ScrollStack from '../../components/ScrollStack/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import Seo from '../../components/Seo/index.ts'
import SubNav from '../../components/SubNav/index.ts'
import { useMediaQuery } from '../../hooks/useMediaQuery/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import HeroLineup from './HeroLineup.tsx'
import MonitorSection from './MonitorSection.tsx'
import { ctaCopy, heroCopy, hubSeo, subNavItems, zoneCopy } from './softwareHubCopy.ts'
import { useSubNavArrival } from './useSubNavArrival.ts'
import styles from './SoftwareHub.module.css'

const SUBNAV_IDS = subNavItems.map((item) => item.id)

const zoneItems = zoneCopy.items.map((item) => ({
  id: item.id,
  eyebrow: item.eyebrow,
  title: item.title,
  description: item.description,
  bullets: item.bullets,
  media: (
    <MediaFrame caption={item.caption} parallax={2} radius="md">
      <Picture {...item.image} sizes="(min-width: 1024px) 38rem, 100vw" />
    </MediaFrame>
  ),
}))

/** SubNav çubuğunun yüksekliği (SubNav.module.css .inner, 3.25rem). */
const SUBNAV_REM = 3.25

/**
 * Zone kartları yalnızca gerçekten yapışmışken alt menüyü gizletir. Kartlar liste üstü navbar altındaki yapışma
 * çizgisine (--ss-nav) ulaşınca yapışır; son kart çubukların (navbar + alt menü) altından çıkınca menü geri gelir.
 * Liste sarmalayıcısını ekranın üst şeridinde görmek yetmez: #canli-izleme bağlantısıyla gelindiğinde yığının alt
 * boşluğu o şeritte kalır ama kart yoktur, menü görünür ve tıklanabilir kalmalıdır.
 */
function useStackPinned(ref: RefObject<HTMLDivElement | null>, enabled: boolean) {
  const { scrollY } = useScroll()
  const [pinned, setPinned] = useState(false)

  const update = () => {
    const wrap = ref.current
    const list = wrap?.firstElementChild
    if (!enabled || !wrap || !list) return setPinned(false)
    const rem = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
    const stick = (Number.parseFloat(getComputedStyle(list).getPropertyValue('--ss-nav')) || 4.5) * rem
    const { top, bottom } = wrap.getBoundingClientRect()
    setPinned(top <= stick + 1 && bottom > stick + SUBNAV_REM * rem)
  }

  useMotionValueEvent(scrollY, 'change', update)
  // İlk yüklemede (ör. #canli-izleme ile açılış) ve genişlik/hareket tercihi değişince kaydırma beklenmeden hesaplanır.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(update, [enabled])

  return enabled && pinned
}

/** /yazilim-urunleri — Park Yazılım merkezi: Zone ekranları ve canlı izleme. */
export default function SoftwareHub() {
  const path = usePath()
  const reduce = Boolean(useReducedMotion())
  const wide = useMediaQuery('(min-width: 1024px)')
  const stackRef = useRef<HTMLDivElement>(null)
  // Yapışmış Zone kartları ekranın üst şeridini kaplarken alt menü kartları örtmesin diye yukarı çekilir.
  const stackCoversTop = useStackPinned(stackRef, wide && !reduce)
  // Alt menü hedeflerinde başlık, varışta görünen çubukların 1rem altına oturur (önceki bölümden şerit kalmaz).
  useSubNavArrival(SUBNAV_IDS, reduce)

  return (
    <>
      <Seo title={hubSeo.title} description={hubSeo.description} />

      <PageHero
        variant="split"
        tone="paper"
        eyebrow={heroCopy.eyebrow}
        title={heroCopy.title}
        lead={heroCopy.lead}
        mediaOrder="last"
        media={<HeroLineup />}
        actions={
          <>
            <Magnetic>
              <Button to={path(heroCopy.primary.route)} size="lg" arrow>
                {heroCopy.primary.label}
              </Button>
            </Magnetic>
            <Button to={path(heroCopy.secondary.route)} variant="secondary" size="lg">
              {heroCopy.secondary.label}
            </Button>
          </>
        }
      />

      <SubNav items={subNavItems} hidden={stackCoversTop} />

      <Section id="zone" tone="surface" spacing="lg" labelledBy="hub-zone-title">
        <SectionHeading eyebrow={zoneCopy.eyebrow} title={zoneCopy.title} lead={zoneCopy.lead} id="hub-zone-title" className={styles.heading} />
        <div ref={stackRef}>
          <ScrollStack items={zoneItems} label={zoneCopy.listLabel} />
        </div>
      </Section>

      <MonitorSection />

      <CtaBand
        eyebrow={ctaCopy.eyebrow}
        title={ctaCopy.title}
        description={ctaCopy.description}
        primary={{ label: ctaCopy.primary.label, to: path(ctaCopy.primary.route) }}
        secondary={{ label: ctaCopy.secondary.label, to: path(ctaCopy.secondary.route) }}
      />
    </>
  )
}
