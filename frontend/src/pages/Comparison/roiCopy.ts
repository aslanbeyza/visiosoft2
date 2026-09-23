/**
 * Amortisman simülatörünün metinleri ve hesap varsayımları.
 *
 * Buradaki sayılar ziyaretçiye "Hesaplama standartları" olarak gösterilir; yani Visiosoft'un arkasında
 * durabileceği değerler olmalı. Değiştirmek için tek yer burasıdır, bileşende sabit sayı yoktur.
 *
 * Yatırım tutarı kaydırıcı değildir: tipik otonom paket maliyeti sabittir; amortisman = yatırım / aylık tasarruf.
 */

export type RoiFieldId = 'staff' | 'vehicles' | 'fee'

export type RoiField = {
  id: RoiFieldId
  label: string
  min: number
  max: number
  step: number
  initial: number
  /** Kaydırıcının iki ucundaki açıklama. */
  minLabel: string
  maxLabel: string
}

/** Hesap sabitleri — kaynak varsayımlar. */
export const roiAssumptions = {
  /** Vardiyalı gişe personeli başına aylık işveren maliyeti (maaş + SGK). */
  monthlyStaffCost: 42_000,
  /** Araç başına bilet/rulo ve mekanik bakım payı. */
  ticketCost: 0.5,
  /** Manuel bariyer denetiminde önlenen kaçak oranı. */
  leakRate: 0.05,
  /** Tipik otonom geçiş paketi yatırımı (amortisman hesabında kullanılır). */
  systemInvestment: 450_000,
}

export const roiCopy = {
  id: 'amortisman',
  eyebrow: 'Finansal fizibilite & amortisman simülatörü',
  title: 'Otonom sisteme geçişte yatırımınız kaç ayda geri döner?',
  lead: 'Mevcut personel sayınızı ve aylık trafiğinizi girin; şeffaf formüllerle yıllık tasarrufu ve tahmini amortisman süresini görün.',

  fields: [
    {
      id: 'staff',
      label: 'Vardiyalı gişe personeli',
      min: 1,
      max: 10,
      step: 1,
      initial: 1,
      minLabel: '1 personel',
      maxLabel: '10 personel (vardiyalı)',
    },
    {
      id: 'vehicles',
      label: 'Aylık ortalama araç',
      min: 2_000,
      max: 60_000,
      step: 1_000,
      initial: 15_000,
      minLabel: '2.000 araç / ay',
      maxLabel: '60.000 araç / ay',
    },
    {
      id: 'fee',
      label: 'Ortalama geçiş ücreti',
      min: 30,
      max: 250,
      step: 5,
      initial: 60,
      minLabel: '30 ₺ / araç',
      maxLabel: '250 ₺ / araç',
    },
  ] satisfies RoiField[],

  /** Kaydırıcı değerinin yanındaki birim. */
  units: {
    staff: 'personel',
    vehicles: 'araç',
    fee: '₺',
  },

  breakdownLabel: 'Yıllık tasarruf ve ek gelir dökümü',
  lines: {
    staff: 'Gişe personeli gider tasarrufu',
    paper: 'Bilet rulosu & mekanik bakım',
    leak: 'Manuel bariyer denetimi (%5 kaçak)',
  },
  totalLabelBefore: 'gişe görevlisi ile yıllık net ek kazanç',
  totalLabelZero: '0',
  roiLabel: 'Tahmini amortisman (ROI)',
  roiUnit: 'ay',
  note: 'Amortisman süresinden sonraki tüm tasarruf doğrudan işletme kârınıza kalır.',
  cta: 'Detaylı fizibilite raporu iste',

  standardsLabel: 'Hesaplama standartları',
  standards: (a: typeof roiAssumptions) =>
    [
      `Personel başı maliyet: ${a.monthlyStaffCost.toLocaleString('tr-TR')} ₺ / ay (maaş + SGK)`,
      `Ortalama bilet / rulo maliyeti: ${a.ticketCost.toLocaleString('tr-TR')} ₺`,
      `Manuel bariyer denetimi ile kaçak önleme: %${(a.leakRate * 100).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`,
      `Tipik otonom paket yatırımı: ${a.systemInvestment.toLocaleString('tr-TR')} ₺`,
    ] as const,
}
