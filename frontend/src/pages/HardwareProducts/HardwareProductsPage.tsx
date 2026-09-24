import { useLocation } from 'react-router-dom'
import { routeNameFromPath } from '../../lib/index.ts'
import HardwareCatalog from './HardwareCatalog.tsx'
import HardwareListing from './HardwareListing.tsx'

export default function HardwareProductsPage() {
  const { pathname } = useLocation()
  const normalized = pathname.replace(/\/+$/, '') || '/'
  return routeNameFromPath(normalized) === 'hardware-products.catalog' ? <HardwareCatalog /> : <HardwareListing />
}
