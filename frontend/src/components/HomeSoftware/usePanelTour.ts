import { useMemo, useState } from 'react'
import type { ParkId, SessionRow, ViewId } from './panelTourData.ts'
import { parkName, sessions } from './panelTourData.ts'

export type SessionFilter = 'all' | 'inside' | 'paid'
export type PlanFilter = 'all' | 'monthly' | 'staff'
export type GateKey = 'entry' | 'exit'

export type BarrierEvent = { park: string; key: GateKey; time: string }

const seedLogs: BarrierEvent[] = [
  { park: 'Demo Merkez', key: 'entry', time: '11:42:08' },
  { park: 'Demo Sahil', key: 'exit', time: '11:40:15' },
  { park: 'Demo Havalimanı', key: 'entry', time: '11:38:21' },
]

export function usePanelTour() {
  const [view, setView] = useState<ViewId>('overview')
  const [menuOpen, setMenuOpen] = useState(false)
  const [park, setPark] = useState<ParkId>('all')
  const [filter, setFilter] = useState<SessionFilter>('all')
  const [query, setQuery] = useState('')
  const [period, setPeriod] = useState(1)
  const [metric, setMetric] = useState(1)
  const [plan, setPlan] = useState<PlanFilter>('all')
  const [selectedPlate, setSelectedPlate] = useState<string | null>(null)
  const [openGates, setOpenGates] = useState<Set<string>>(() => new Set())
  const [barrierEvents, setBarrierEvents] = useState<BarrierEvent[]>(seedLogs)

  const openView = (next: ViewId) => {
    setView(next)
    setMenuOpen(false)
    if (next === 'cameras' && park === 'all') setPark('centre')
  }

  const rows = useMemo(() => {
    const name = parkName(park)
    const needle = query.toLowerCase().replaceAll(' ', '')
    return sessions.filter((row) => {
      const inPark = park === 'all' || row.park === name
      const matchesFilter = filter === 'all' || (filter === 'inside' ? row.exit === '—' : row.exit !== '—')
      const matchesQuery = row.plate.toLowerCase().replaceAll(' ', '').includes(needle)
      return inPark && matchesFilter && matchesQuery
    })
  }, [park, filter, query])

  const openGate = (key: GateKey) => {
    const name = parkName(park === 'all' ? 'centre' : park)
    const id = name + key
    if (openGates.has(id)) return
    const now = new Date()
    const time = [now.getHours(), now.getMinutes(), now.getSeconds()].map((part) => String(part).padStart(2, '0')).join(':')
    setOpenGates((current) => new Set(current).add(id))
    setBarrierEvents((current) => [{ park: name, key, time }, ...current])
  }

  return {
    view,
    openView,
    menuOpen,
    setMenuOpen,
    park,
    setPark,
    filter,
    setFilter,
    query,
    setQuery,
    period,
    setPeriod,
    metric,
    setMetric,
    plan,
    setPlan,
    selectedPlate,
    setSelectedPlate,
    openGates,
    openGate,
    barrierEvents,
    rows,
  }
}

export type PanelTourState = ReturnType<typeof usePanelTour>

export function inPark(row: SessionRow, park: ParkId) {
  return park === 'all' || row.park === parkName(park)
}
