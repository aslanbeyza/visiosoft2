
export type RoiFieldId = 'staff' | 'vehicles' | 'fee'

export type RoiField = {
  id: RoiFieldId
  label: string
  min: number
  max: number
  step: number
  initial: number
}

export const roiAssumptions = {

  monthlyStaffCost: 42_000,

  ticketCost: 0.5,

  leakRate: 0.05,

  systemInvestment: 450_000,
}

const plain = (value: number) => value.toLocaleString('tr-TR')

export const roiCopy = {
  id: 'amortisman',
  title: 'Yatırımınız kaç ayda geri döner?',

  fields: [
    { id: 'staff', label: 'Gişe personeli', min: 1, max: 10, step: 1, initial: 1 },
    { id: 'vehicles', label: 'Aylık araç', min: 2_000, max: 60_000, step: 1_000, initial: 15_000 },
    { id: 'fee', label: 'Ortalama ücret', min: 30, max: 250, step: 5, initial: 60 },
  ] satisfies RoiField[],

  units: {
    staff: 'personel',
    vehicles: 'araç',
    fee: '₺',
  },

  totalLabel: 'Yıllık tasarruf ve ek gelir',
  roi: (months: string) => `Kendini ${months} ayda öder`,
  cta: 'Detaylı fizibilite raporu iste',
  /** One line so the result stays traceable without a block of text. */
  assumptions: (a: typeof roiAssumptions) =>
    `Hesap: personel ${plain(a.monthlyStaffCost)} ₺/ay · bilet ${plain(a.ticketCost)} ₺ · kaçak %${plain(a.leakRate * 100)} · paket ${plain(a.systemInvestment)} ₺`,
}
