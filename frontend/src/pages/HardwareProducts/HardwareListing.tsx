import { useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import Seo from '../../components/Seo/index.ts'
import CatalogTeaser from './CatalogTeaser.tsx'
import CategoriesSection from './CategoriesSection.tsx'
import type { FilterKey } from './CategoryFilter.tsx'
import type { CategoryKey } from './data.ts'
import HeroLineup from './HeroLineup.tsx'
import { listingSeo } from './listingCopy.ts'
import ProductsSection from './ProductsSection.tsx'

export default function HardwareListing() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState<FilterKey>('all')

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
      <ProductsSection active={active} onChange={setActive} />
      <CategoriesSection onSelect={selectCategory} />
      <CatalogTeaser />
    </>
  )
}
