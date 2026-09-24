import type { AssuranceColumnId, WorkStepId } from './homeAssuranceCopy.ts'

export const columnIcons: Record<AssuranceColumnId, string[]> = {

  support: [
    'M4.5 13.5v-2a7.5 7.5 0 0 1 15 0v2',
    'M4.5 13.5a1.5 1.5 0 0 1 1.5-1.5h1a1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1H6a1.5 1.5 0 0 1-1.5-1.5Z',
    'M19.5 13.5a1.5 1.5 0 0 0-1.5-1.5h-1a1 1 0 0 0-1 1v3.5a1 1 0 0 0 1 1h1',
    'M19.5 13.5V16a4 4 0 0 1-4 4H13',
  ],

  security: ['M12 3.2 5 5.8v5.4c0 4.4 2.9 8.1 7 9.6 4.1-1.5 7-5.2 7-9.6V5.8Z', 'm8.9 12 2.2 2.2 4-4.3'],

  integration: [
    'M9 6.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z',
    'M20 6.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z',
    'M14.5 17.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z',
    'M9 6.5h6M7.6 8.6l3.1 6.6M16.4 8.6l-3.1 6.6',
  ],
}

export const stepIcons: Record<WorkStepId, string[]> = {
  discovery: ['M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z', 'M12 12.3a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6Z'],
  install: ['M14.7 6.3a4 4 0 0 0-5.4 5.4l-5.8 5.8a1.5 1.5 0 0 0 2.1 2.1l5.8-5.8a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.1-.5-.5-2.1Z'],
  monitor: [
    'M4.5 4h15A1.5 1.5 0 0 1 21 5.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 14.5v-9A1.5 1.5 0 0 1 4.5 4Z',
    'M8 20h8M12 16v4',
    'm7 11.5 2.5-2.5 2.5 2 4-4',
  ],
}

export const checkPath = 'm6.5 12.4 3.4 3.3 7.6-7.6'
export const arrowPath = 'M5 12h14M13 6l6 6-6 6'
