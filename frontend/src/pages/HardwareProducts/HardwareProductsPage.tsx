import { useLocation } from 'react-router-dom'
import { routeNameFromPath } from '../../lib/index.ts'
import HardwareCatalog from './HardwareCatalog.tsx'
import HardwareListing from './HardwareListing.tsx'

/**
 * Marketing.tsx hem /donanim-urunleri hem /donanim-urunleri/katalog için bu sayfayı açar;
 * hangi görünümün gösterileceği geçerli yoldan belirlenir.
 */
export default function HardwareProductsPage() {
  const { pathname } = useLocation()
  const normalized = pathname.replace(/\/+$/, '') || '/'
  return routeNameFromPath(normalized) === 'hardware-products.catalog' ? <HardwareCatalog /> : <HardwareListing />
}
