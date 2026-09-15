import Hero from '../../components/Hero/index.ts'
import HomeAssurance from '../../components/HomeAssurance/index.ts'
import HomeCta from '../../components/HomeCta/index.ts'
import HomeField from '../../components/HomeField/index.ts'
import HomeProof from '../../components/HomeProof/index.ts'
import HomeSectors from '../../components/HomeSectors/index.ts'
import Seo from '../../components/Seo/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'

/**
 * Arama ve paylaşım açıklaması yalnızca sayfadaki onaylı metinlerden kurulur
 * (Hero başlığı + açıklaması). tr.json tek dil olduğu için literal tutulur.
 */
const HOME_DESCRIPTION =
  "Otoparkınızı tek merkezden yönetin: plaka tanıma, temassız ödeme, HGS, bariyer kontrolü ve raporlama tek sistemde. 2018'den beri, 7/24 uzaktan destek."

/**
 * Saha kanıtı önde: geçiş videosu, referanslar, donanım vitrini.
 */
export default function Home() {
  const { t } = useLocale()

  return (
    <>
      <Seo title={t('Visiosoft - İnsansız Otopark Yönetim Sistemleri')} description={HOME_DESCRIPTION} />

      <Hero />
      <HomeProof />
      <HomeField />
      <HomeSectors />
      <HomeCta />
      <HomeAssurance />
    </>
  )
}
