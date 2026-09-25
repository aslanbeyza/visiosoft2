import { productGalleryCopy as copy, type GalleryProduct, type GalleryProductId } from './productGalleryCopy.ts'
import styles from './ProductPicker.module.css'

// Products and their points are separate blocks so the page can put the model between them on a phone.

type ProductListProps = {
  className: string
  products: GalleryProduct[]
  selectedId: GalleryProductId
  isLoading: boolean
  onSelect: (id: GalleryProductId) => void
}

export function ProductList({ className, products, selectedId, isLoading, onSelect }: ProductListProps) {
  return (
    <nav className={className} aria-label={copy.pickerLabel} aria-busy={isLoading}>
      <ul className={styles.products}>
        {products.map((product) => (
          <li key={product.id}>
            <button type="button" className={styles.product} aria-pressed={product.id === selectedId} onClick={() => onSelect(product.id)}>
              <b>{product.name}</b>
              <span>{product.role}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

type PointListProps = {
  className: string
  product: GalleryProduct
  activePointId: string | null
  onSelect: (id: string) => void
}

export function PointList({ className, product, activePointId, onSelect }: PointListProps) {
  return (
    <ol className={`${className} ${styles.points}`} aria-label={copy.pointsLabel(product.name)}>
      {product.points.map((point) => (
        <li key={point.id}>
          <button type="button" className={styles.point} aria-pressed={point.id === activePointId} onClick={() => onSelect(point.id)}>
            <b>{point.title}</b>
            <span>{point.text}</span>
          </button>
        </li>
      ))}
    </ol>
  )
}
