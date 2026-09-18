export type FinancePeriod = 'daily' | 'weekly' | 'monthly' | 'hours24'

export type FinanceSnapshot = {
  crossings: number
  paid: number
  paidRate: number
  subscribers: number
  subscriberRate: number
  freeList: number
  free: number
  whitelist: number
  revenue: number
  paidPassages: number
  collected: number
  collectedVehicles: number
  collectedShare: number
  cash: number
  cashVehicles: number
  cashShare: number
  debt: number
  debtVehicles: number
  debtShare: number
  /** 0–1 arası trend noktaları (grafik). */
  trend: number[]
  trendLabels: string[]
}

export const financeDemoCopy = {
  brand: 'ZonE',
  park: 'DEFAULT OTOPARK',
  navActive: 'Finansal Rapor',
  caption: 'Zone finansal özet — dönem seçerek canlı demo',
  ariaLabel: 'Zone finansal rapor özeti',
  periodsLabel: 'Dönem filtresi',
  periods: [
    { id: 'daily' as const, label: 'Günlük' },
    { id: 'weekly' as const, label: 'Haftalık' },
    { id: 'monthly' as const, label: 'Aylık' },
    { id: 'hours24' as const, label: 'Son 24 Saat' },
  ],
  cards: {
    crossings: { title: 'Toplam Geçiş', hint: 'Tüm Araçlar' },
    paid: { title: 'Ücretli Geçiş' },
    subscribers: { title: 'Abone' },
    freeList: {
      title: 'Ücretsiz / Beyaz Liste',
      free: 'Ücretsiz',
      whitelist: 'Beyaz Liste',
    },
    revenue: {
      title: (period: FinancePeriod) =>
        period === 'weekly' ? 'Toplam Ciro (Haftalık)' : period === 'monthly' ? 'Toplam Ciro (Aylık)' : period === 'hours24' ? 'Toplam Ciro (24 Saat)' : 'Toplam Ciro (Günlük)',
      paidPassages: (n: number) => `${n} Toplam Ücretli Araç Geçişi`,
    },
    trend: { title: 'Ciro Trend Analizi' },
    collected: { title: 'Başarılı Tahsilat', meta: (v: number, share: number) => `${v} Araç · %${share} Ciro Payı` },
    cash: { title: 'Nakit Ödeme', meta: (v: number, share: number) => `${v} Araç · %${share} Ciro Payı` },
    debt: { title: 'Borçlu', meta: (v: number, share: number) => `${v} Araç · %${share} Ciro Payı` },
  },
}

export const financeSnapshots: Record<FinancePeriod, FinanceSnapshot> = {
  daily: {
    crossings: 100,
    paid: 50,
    paidRate: 50,
    subscribers: 15,
    subscriberRate: 15,
    freeList: 35,
    free: 12,
    whitelist: 23,
    revenue: 2000,
    paidPassages: 50,
    collected: 1850,
    collectedVehicles: 46,
    collectedShare: 92,
    cash: 420,
    cashVehicles: 11,
    cashShare: 21,
    debt: 150,
    debtVehicles: 4,
    debtShare: 8,
    trend: [0.18, 0.22, 0.35, 0.42, 0.58, 0.71, 0.64, 0.88],
    trendLabels: ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '00:00'],
  },
  weekly: {
    crossings: 742,
    paid: 381,
    paidRate: 51,
    subscribers: 118,
    subscriberRate: 16,
    freeList: 243,
    free: 84,
    whitelist: 159,
    revenue: 14860,
    paidPassages: 381,
    collected: 13640,
    collectedVehicles: 352,
    collectedShare: 92,
    cash: 2980,
    cashVehicles: 78,
    cashShare: 20,
    debt: 1220,
    debtVehicles: 29,
    debtShare: 8,
    trend: [0.32, 0.41, 0.55, 0.48, 0.67, 0.79, 0.92],
    trendLabels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
  },
  monthly: {
    crossings: 3120,
    paid: 1584,
    paidRate: 51,
    subscribers: 486,
    subscriberRate: 16,
    freeList: 1050,
    free: 360,
    whitelist: 690,
    revenue: 62400,
    paidPassages: 1584,
    collected: 57800,
    collectedVehicles: 1462,
    collectedShare: 93,
    cash: 12100,
    cashVehicles: 310,
    cashShare: 19,
    debt: 4600,
    debtVehicles: 122,
    debtShare: 7,
    trend: [0.28, 0.36, 0.44, 0.51, 0.63, 0.58, 0.72, 0.81, 0.76, 0.88, 0.94, 1],
    trendLabels: ['1', '3', '6', '9', '12', '15', '18', '21', '24', '27', '29', '30'],
  },
  hours24: {
    crossings: 128,
    paid: 64,
    paidRate: 50,
    subscribers: 19,
    subscriberRate: 15,
    freeList: 45,
    free: 16,
    whitelist: 29,
    revenue: 2560,
    paidPassages: 64,
    collected: 2380,
    collectedVehicles: 59,
    collectedShare: 93,
    cash: 510,
    cashVehicles: 14,
    cashShare: 20,
    debt: 180,
    debtVehicles: 5,
    debtShare: 7,
    trend: [0.12, 0.15, 0.2, 0.28, 0.41, 0.55, 0.62, 0.7, 0.78, 0.85, 0.72, 0.58],
    trendLabels: ['00', '02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22'],
  },
}
