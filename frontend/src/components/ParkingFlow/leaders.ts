import type { ParkingFlowDevice } from './parkingFlowCopy.ts'

export type LeaderAnchor = 'start' | 'end'

export type LeaderFrame = readonly [number, number, number, number]

export type Leader = { d: string; x: number; y: number; anchor: LeaderAnchor; frame: LeaderFrame }

export const leaders: Record<ParkingFlowDevice, Leader> = {

  camera: { d: 'M362 118V86h58', x: 420, y: 86, anchor: 'start', frame: [306, 102, 108, 75] },

  controlBox: { d: 'M304 240H296V40h124', x: 420, y: 40, anchor: 'start', frame: [288, 206, 80, 92] },

  pole: { d: 'M328 120V60h92', x: 420, y: 60, anchor: 'start', frame: [295, 298, 66, 60] },

  ledPanel: { d: 'M169 182V52h59', x: 228, y: 52, anchor: 'start', frame: [102, 166, 134, 104] },

  kiosk: { d: 'M715 137V78h-35', x: 680, y: 78, anchor: 'end', frame: [668, 121, 94, 237] },

  barrier: { d: 'M928 276H884V62h-14', x: 870, y: 62, anchor: 'end', frame: [904, 246, 82, 210] },
}
