/**
 * Kullanım: <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Service', name: '…' }} />
 * Bileşen bağlıyken <head> içine application/ld+json betiği ekler; kaldırılınca betik de silinir.
 * Görsel çıktısı yoktur.
 */
import { useEffect } from 'react'

export type JsonLdProps = {
  data: object
  /** İsteğe bağlı betik kimliği (aynı kimlikli betik yenilenir). */
  id?: string
}

/** JSON içindeki "<" karakteri betiği erken kapatamasın diye kaçırılır. */
const serialize = (data: object) => JSON.stringify(data).replace(/</g, '\\u003c')

export default function JsonLd({ data, id }: JsonLdProps) {
  const json = serialize(data)

  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    if (id) script.id = id
    script.textContent = json
    document.head.appendChild(script)
    return () => {
      script.remove()
    }
  }, [json, id])

  return null
}
