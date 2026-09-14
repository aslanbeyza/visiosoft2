import Hero from '../../components/Hero/index.ts'
import HomeAssurance from '../../components/HomeAssurance/index.ts'
import HomeCta from '../../components/HomeCta/index.ts'
import HomeFlagships from '../../components/HomeFlagships/index.ts'
import HomeSectors from '../../components/HomeSectors/index.ts'
import HomeSystemFlow from '../../components/HomeSystemFlow/index.ts'
import HomeTrust from '../../components/HomeTrust/index.ts'
import HomeZone from '../../components/HomeZone/index.ts'
import KioskZoom from '../../components/KioskZoom/index.ts'
import Seo from '../../components/Seo/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'

/**
 * Arama ve paylaşım açıklaması yalnızca sayfadaki onaylı metinlerden kurulur
 * (Hero başlığı + açıklaması, Kurumsal rakamları). tr.json tek dil olduğu için literal tutulur.
 */
const HOME_DESCRIPTION =
  "Otoparkınızı tek merkezden yönetin: plaka tanıma, temassız ödeme, HGS, bariyer kontrolü ve raporlama tek sistemde. 2018'den beri, 7/24 uzaktan destek."

/** Yakın plan kiosk: kare başına kaydırma uzunluğu (svh). 45, sayacı 01→05 okunur adımlarla korur. */
const KIOSK_FRAME_LENGTH = 45

/** Yazılım önde ana sayfa: sistem akışı ve Zone paneli donanımdan önce gelir. */
export default function Home() {
  const { t } = useLocale()

  return (
    <>
      <Seo title={t('Visiosoft - İnsansız Otopark Yönetim Sistemleri')} description={HOME_DESCRIPTION} />

      <Hero />
      <HomeTrust />
      <HomeSystemFlow />
      <HomeZone />
      <HomeSectors />
      <HomeFlagships />
      <KioskZoom frameLength={KIOSK_FRAME_LENGTH} />
      <HomeAssurance />
      <HomeCta />
    </>
  )
}
