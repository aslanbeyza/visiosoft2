import { useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import CtaBand from '../../components/CtaBand/index.ts'
import Seo from '../../components/Seo/index.ts'
import SubNav from '../../components/SubNav/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import CatalogTeaser from './CatalogTeaser.tsx'
import CategoriesSection from './CategoriesSection.tsx'
import type { FilterKey } from './CategoryFilter.tsx'
import type { CategoryKey } from './data.ts'
import HeroLineup from './HeroLineup.tsx'
import { ctaCopy, listingSeo, subNavItems } from './listingCopy.ts'
import ProductsSection from './ProductsSection.tsx'

/** /donanim-urunleri: ürün dizisi hero'su → alt menü → filtrelenebilir kartlar → kategoriler + sayılar → katalog → CTA. */
export default function HardwareListing() {
  const path = usePath()
  const reduce = useReducedMotion()
  const [active, setActive] = useState<FilterKey>('all')

  // Kategori satırından seçim: filtre uygulanır, ürünlere kaydırılır ve odak ilgili çipe taşınır.
  const selectCategory = (key: CategoryKey) => {
    setActive(key)
    const section = document.getElementById('urunler')
    if (!section) return
    section.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    section.querySelector<HTMLButtonElement>(`[data-filter-key="${key}"]`)?.focus({ preventScroll: true })
  }

  return (
    <>
      <Seo title={listingSeo.title} description={listingSeo.description} />
      <HeroLineup />
      <SubNav items={subNavItems} />
      <ProductsSection active={active} onChange={setActive} />
      <CategoriesSection onSelect={selectCategory} />
      <CatalogTeaser />
      <CtaBand
        eyebrow={ctaCopy.eyebrow}
        title={ctaCopy.title}
        description={ctaCopy.description}
        primary={{ label: ctaCopy.primary, to: path('discovery.show') }}
        secondary={{ label: ctaCopy.secondary, to: path('quote.index') }}
      />
    </>
  )
}
