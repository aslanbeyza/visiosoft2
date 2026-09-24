import Hero from '../../components/HeroGate/index.ts'
import HomeAssurance from '../../components/HomeAssurance/index.ts'
import HomeCta from '../../components/HomeCta/index.ts'
import HomeField from '../../components/HomeField/index.ts'
import HomeProof from '../../components/HomeProof/index.ts'
import HomeSectors from '../../components/HomeSectors/index.ts'
import HomeZone from '../../components/HomeZone/index.ts'
import Seo from '../../components/Seo/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'

const HOME_DESCRIPTION =
  "Otoparkınızı tek merkezden yönetin: plaka tanıma, temassız ödeme, HGS, bariyer kontrolü ve raporlama tek sistemde. 2018'den beri, 7/24 uzaktan destek."

export default function Home() {
  const { t } = useLocale()

  return (
    <>
      <Seo title={t('Visiosoft - İnsansız Otopark Yönetim Sistemleri')} description={HOME_DESCRIPTION} />

      <Hero />
      <HomeProof />
      <HomeField />
      <HomeZone />
      <HomeSectors />
      <HomeCta />
      <HomeAssurance />
    </>
  )
}
