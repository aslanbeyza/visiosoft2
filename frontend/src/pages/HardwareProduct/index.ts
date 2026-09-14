// Eski sayfa legacy/pages-v1/HardwareProduct'a taşındı; tüm donanım rotaları ProductDetail şablonunu kullanır.
export { default } from '../ProductDetail/index.ts'
export { getHardwareProduct, hardwareSlugs, isHardwareSlug, productNav, products } from './products.ts'
export type { HardwareSlug } from './products.ts'
