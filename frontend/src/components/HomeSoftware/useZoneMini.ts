import { useState } from 'react'
import type { FormEvent } from 'react'
import { seedAllow, seedDeny, zoneMiniCopy as text } from './zoneMiniCopy.ts'
import type { ListKind, ZonePage, ZonePlate } from './zoneMiniCopy.ts'

const platePattern = /^[0-9]{2}\s?[A-ZÇĞİÖŞÜ]{1,3}\s?[0-9]{2,4}$/

function normalizePlate(value: string) {
  return value
    .toLocaleUpperCase('tr-TR')
    .replace(/[^0-9A-ZÇĞİÖŞÜ\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function nextId() {
  return `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

/** Laptop ve telefon aynı Zone kaydını paylaşır. */
export function useZoneMini() {
  const [page, setPage] = useState<ZonePage>('allow')
  const [openGroups, setOpenGroups] = useState<string[]>(() => text.groups.map((group) => group.id))
  const [allow, setAllow] = useState(seedAllow)
  const [deny, setDeny] = useState(seedDeny)
  const [plate, setPlate] = useState('')
  const [note, setNote] = useState('')
  const [message, setMessage] = useState('')

  const kind: ListKind = page === 'deny' ? 'deny' : 'allow'
  const list = page === 'deny' ? deny : allow

  const goTo = (next: ZonePage) => {
    setPage(next)
    setMessage('')
  }

  const toggleGroup = (id: string) => {
    setOpenGroups((ids) => (ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]))
  }

  const handleAdd = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const next = normalizePlate(plate)
    if (!platePattern.test(next)) {
      setMessage(text.invalid)
      return
    }
    if (allow.some((row) => row.plate === next) || deny.some((row) => row.plate === next)) {
      setMessage(text.duplicate)
      return
    }

    const row: ZonePlate = { id: nextId(), plate: next, note: note.trim() }
    if (kind === 'allow') setAllow((rows) => [row, ...rows])
    else setDeny((rows) => [row, ...rows])
    setPlate('')
    setNote('')
    setMessage(kind === 'allow' ? text.addedAllow : text.addedDeny)
  }

  const handleRemove = (id: string) => {
    if (kind === 'allow') setAllow((rows) => rows.filter((row) => row.id !== id))
    else setDeny((rows) => rows.filter((row) => row.id !== id))
  }

  return {
    page,
    openGroups,
    allow,
    deny,
    plate,
    note,
    message,
    kind,
    list,
    counts: { allow: allow.length, deny: deny.length } satisfies Partial<Record<ZonePage, number>>,
    goTo,
    toggleGroup,
    setPlate,
    setNote,
    handleAdd,
    handleRemove,
  }
}

export type ZoneMiniState = ReturnType<typeof useZoneMini>
export type ZoneLayout = 'desktop' | 'phone'
