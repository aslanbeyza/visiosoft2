import { trimmedLogoUrls } from './logos/index.ts'
import { references } from './references.ts'

export type SectorKey = 'belediye' | 'kurum-teknopark' | 'avm-otel' | 'universite' | 'diger'

export const sectorOrder: SectorKey[] = ['belediye', 'kurum-teknopark', 'avm-otel', 'universite', 'diger']

export const sectorLabels: Record<SectorKey, string> = {
  belediye: 'Belediye',
  'kurum-teknopark': 'Kurum & Teknopark',
  'avm-otel': 'AVM & Otel',
  universite: 'Üniversite',
  diger: 'Diğer',
}

// Sektör, yalnızca referans adındaki anahtar kelimelerden türetilir (ek veri yok)
const rules: [SectorKey, RegExp][] = [
  ['belediye', /belediyesi/iu],
  ['universite', /üniversite/iu],
  ['avm-otel', /avm|hilton|crowne plaza|center/iu],
  ['kurum-teknopark', /kaymakamlığı|valiliği|teknokent|teknopark|holding|bank/iu],
]

export const sectorOf = (name: string): SectorKey => rules.find(([, pattern]) => pattern.test(name))?.[0] ?? 'diger'

// Görünen ad düzeltmesi: sıra sayısından sonra boşluk ("2.Matbaacılar" → "2. Matbaacılar")
const displayName = (name: string) => name.replace(/^(\d+)\.(?=\S)/u, '$1. ')

// Logolar kırpılmış, zemini saydam kopyalarla gösterilir; kopyası olmayan dosya özgün URL'sine düşer.
export const referenceItems = references.map((reference) => ({
  ...reference,
  name: displayName(reference.name),
  url: trimmedLogoUrls[reference.file.normalize('NFC')] ?? reference.url,
  sector: sectorOf(reference.name),
}))

export type ReferenceItem = (typeof referenceItems)[number]

export const sectorCounts = sectorOrder.reduce(
  (counts, key) => ({ ...counts, [key]: referenceItems.filter((item) => item.sector === key).length }),
  {} as Record<SectorKey, number>,
)
