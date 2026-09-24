export const parks = [
  ['centre', 'Demo Merkez'],
  ['coast', 'Demo Sahil'],
  ['airport', 'Demo Havalimanı'],
] as const

export type ParkId = (typeof parks)[number][0] | 'all'

const plates = [
  '34 VS 1923',
  '06 AN 482',
  '35 EZ 710',
  '16 BR 905',
  '07 AK 218',
  '48 DL 637',
  '34 VN 845',
  '06 KT 129',
  '35 SA 406',
  '41 GS 712',
  '34 PB 320',
  '54 YL 983',
  '26 ES 516',
  '09 AY 204',
  '20 DN 678',
  '32 IS 157',
  '34 CE 461',
  '06 MK 850',
]

export type SessionRow = {
  park: string
  plate: string
  entry: string
  exit: string
  duration: string
  fee: number
  method: string
}

export const sessions: SessionRow[] = plates.map((plate, index) => ({
  park: parks[index % 3][1],
  plate,
  entry: `${String(8 + Math.floor(index / 3)).padStart(2, '0')}:${String((index * 13 + 12) % 60).padStart(2, '0')}`,
  exit: index % 4 === 1 ? '—' : `${String(11 + Math.floor(index / 4)).padStart(2, '0')}:${String((index * 7 + 19) % 60).padStart(2, '0')}`,
  duration: index % 4 === 1 ? 'Aktif' : '2 sa',
  fee: index % 4 === 1 ? 0 : [75, 150, 225, 100][index % 4],
  method: index % 4 === 1 ? '—' : ['HGS', 'POS', 'QR', 'Abone'][index % 4],
}))

export type ViewId =
  | 'overview'
  | 'sessions'
  | 'tariffs'
  | 'plates'
  | 'finance'
  | 'comparison'
  | 'subscriptions'
  | 'logs'
  | 'cameras'

type NavItem = { view: ViewId | null; label: string }

export const menu: { group: string; items: NavItem[] }[] = [
  { group: '', items: [{ view: 'overview', label: 'Ana Ekran' }, { view: null, label: 'Destek' }] },
  {
    group: 'Park Yönetimi',
    items: [
      { view: null, label: 'Ayarlar' },
      { view: 'sessions', label: 'Oturumlar' },
      { view: 'tariffs', label: 'Fiyat Tarifesi' },
      { view: null, label: 'Borç Listesi' },
      { view: 'plates', label: 'Plaka Fotoğrafları' },
    ],
  },
  {
    group: 'Finansal',
    items: [
      { view: 'finance', label: 'Finansal Özet' },
      { view: null, label: 'Detaylı Raporlar' },
      { view: 'comparison', label: 'Dönem Karşılaştırması' },
      { view: null, label: 'Ödemeler' },
    ],
  },
  {
    group: 'Abonelik',
    items: [
      { view: null, label: 'Abonelik Paketleri' },
      { view: 'subscriptions', label: 'Abonelikler' },
      { view: null, label: 'Abonelik Sıraları' },
    ],
  },
  {
    group: 'Kamera & Bariyer',
    items: [
      { view: 'logs', label: 'Bariyer Kayıtları' },
      { view: null, label: 'Kameralar' },
      { view: null, label: 'Cihazlar' },
      { view: 'cameras', label: 'Kamera & Bariyer' },
    ],
  },
  { group: 'Kullanıcılar', items: [{ view: null, label: 'Kullanıcılar' }] },
  {
    group: 'Listeler',
    items: [
      { view: null, label: 'Beyaz Listeler' },
      { view: null, label: 'Kara Listeler' },
    ],
  },
  {
    group: 'Mutabakat',
    items: [
      { view: null, label: 'HGS’den Gelen Raporlar' },
      { view: null, label: 'HGS Geçişleri' },
      { view: null, label: 'Günlük Mutabakat Raporu' },
      { view: null, label: 'Mutabakat' },
    ],
  },
  { group: 'Expert', items: [{ view: null, label: 'Tabletler' }] },
  {
    group: 'Pool',
    items: [
      { view: null, label: 'Pool' },
      { view: null, label: 'Radar' },
    ],
  },
  { group: 'Sistem', items: [{ view: null, label: 'PMSP Logları' }] },
]

export const periods = ['Son 24 Saat', 'Son 7 Gün', 'Son 30 Gün']

export function money(amount: number) {
  return `${new Intl.NumberFormat('tr-TR').format(amount)} TL`
}

export function parkName(park: ParkId) {
  return parks.find((item) => item[0] === park)?.[1] ?? 'Tüm Otoparklar'
}
