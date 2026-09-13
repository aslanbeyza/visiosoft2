import Button from '../../components/Button/index.ts'
import PageHero from '../../components/PageHero/index.ts'
import Seo from '../../components/Seo/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'

export default function NotFound() {
  const { t } = useLocale()
  const path = usePath()

  return (
    <>
      <Seo title="404 - Visiosoft" />
      <PageHero
        title={t('Sayfa bulunamadı')}
        description={t('Aradığın sayfa yok.')}
        actions={<Button to={path('home')}>{t('Ana sayfaya dön')}</Button>}
      />
    </>
  )
}
