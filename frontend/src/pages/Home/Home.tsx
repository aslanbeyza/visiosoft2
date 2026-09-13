import CtaBand from '../../components/CtaBand/index.ts'
import Hero from '../../components/Hero/index.ts'
import HomeHgs from '../../components/HomeHgs/index.ts'
import HomeIntro from '../../components/HomeIntro/index.ts'
import HomeProcess from '../../components/HomeProcess/index.ts'
import HomeProducts from '../../components/HomeProducts/index.ts'
import HomeReferences from '../../components/HomeReferences/index.ts'
import HomeSoftware from '../../components/HomeSoftware/index.ts'
import HomeSolutions from '../../components/HomeSolutions/index.ts'
import KioskZoom from '../../components/KioskZoom/index.ts'
import Seo from '../../components/Seo/index.ts'
import SystemShowcase from '../../components/SystemShowcase/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { homeCopy as text } from './homeCopy.ts'

export default function Home() {
  const { t } = useLocale()
  const path = usePath()

  return (
    <>
      <Seo title={t('Visiosoft - İnsansız Otopark Yönetim Sistemleri')} description={t('meta_desc_index')} />

      <Hero />

      <HomeIntro />
      <HomeProducts />
      <KioskZoom />
      <SystemShowcase />
      <HomeSoftware />
      <HomeSolutions />
      <HomeHgs />
      <HomeProcess />
      <HomeReferences />

      <CtaBand
        title={text.cta.title}
        description={text.cta.description}
        primary={{ label: text.cta.primary.label, to: path(text.cta.primary.route) }}
        secondary={{ label: text.cta.secondary.label, to: path(text.cta.secondary.route) }}
      />
    </>
  )
}
