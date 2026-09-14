import DesignerTool from './DesignerTool.tsx'
import KusBakisi from './KusBakisi.tsx'
import LowConfidence from './LowConfidence.tsx'
import MobilAbonelik from './MobilAbonelik.tsx'

/** Dört vitrin rotasını ilgili sayfaya yönlendirir (Marketing.tsx `routeName` geçirir). */
export default function ShowcasePage({ routeName }: { routeName: string }) {
  switch (routeName) {
    case 'kus-bakisi':
      return <KusBakisi />
    case 'mobil-abonelik':
      return <MobilAbonelik />
    case 'designer-tool':
      return <DesignerTool />
    case 'low-confidence':
      return <LowConfidence />
    default:
      return null
  }
}
