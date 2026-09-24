
import { useEffect } from 'react'

export type JsonLdProps = {
  data: object

  id?: string
}

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
