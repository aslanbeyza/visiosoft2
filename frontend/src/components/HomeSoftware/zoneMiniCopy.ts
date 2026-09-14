export type ListKind = 'allow' | 'deny'

export type ZonePlate = {
  id: string
  plate: string
  note: string
}

export type ZonePage =
  | 'panel'
  | 'inside'
  | 'hgs'
  | 'settings'
  | 'sessions'
  | 'photos'
  | 'allow'
  | 'deny'
  | 'payments'
  | 'debt'
  | 'tariffs'
  | 'paySettings'
  | 'report'
  | 'packages'
  | 'subscribers'
  | 'barriers'
  | 'pmp'
  | 'devices'
  | 'cameras'

export type NavItem = {
  id: ZonePage
  label: string
}

export type NavGroup = {
  id: string
  label: string
  items: NavItem[]
}

export type DemoRow = {
  cells: string[]
  tone?: 'ok' | 'warn' | 'bad'
}

export type DemoTable = {
  title: string
  hint: string
  columns: string[]
  rows: DemoRow[]
}

export const zoneMiniCopy = {
  brand: 'ZONE',
  site: 'Partner paneli',
  navLabel: 'Partner menüsü',
  openMenu: 'Menü',
  closeMenu: 'Kapat',
  panelNav: 'Panel',
  groups: [
    {
      id: 'park',
      label: 'Park Yönetimi',
      items: [
        { id: 'inside', label: 'İçerideki Araçlar' },
        { id: 'hgs', label: 'HGS Onayı' },
        { id: 'settings', label: 'Ayarlar' },
        { id: 'sessions', label: 'Oturumlar' },
        { id: 'photos', label: 'Plaka Fotoları' },
        { id: 'allow', label: 'Beyaz Listeler' },
        { id: 'deny', label: 'Kara Listeler' },
      ],
    },
    {
      id: 'finance',
      label: 'Finansal',
      items: [
        { id: 'payments', label: 'Ödemeler' },
        { id: 'debt', label: 'Borç Sorgulama' },
        { id: 'tariffs', label: 'Fiyat Tarifeleri' },
        { id: 'paySettings', label: 'Ödeme Ayarları' },
        { id: 'report', label: 'Finansal Rapor' },
      ],
    },
    {
      id: 'subs',
      label: 'Abonelik',
      items: [
        { id: 'packages', label: 'Abone Paketleri' },
        { id: 'subscribers', label: 'Aboneler' },
      ],
    },
    {
      id: 'tech',
      label: 'Teknik',
      items: [
        { id: 'barriers', label: 'Kamera & Bariyer' },
        { id: 'pmp', label: 'PMP Logları' },
        { id: 'devices', label: 'Cihazlar' },
        { id: 'cameras', label: 'Kameralar' },
      ],
    },
  ] satisfies NavGroup[],
  cards: [
    {
      title: 'Temel Otopark',
      hint: 'Genel park işlemleri ve listeler',
      links: ['inside', 'sessions', 'photos', 'allow', 'deny'] as const,
    },
    {
      title: 'Finansal',
      hint: 'Ödemeler ve finansal raporlar',
      links: ['payments', 'debt', 'tariffs', 'paySettings', 'report'] as const,
    },
    {
      title: 'Abonelik',
      hint: 'Abone paketleri ve aboneler',
      links: ['packages', 'subscribers'] as const,
    },
    {
      title: 'Teknik',
      hint: 'Cihazlar ve teknik ayarlar',
      links: ['barriers', 'pmp', 'devices', 'cameras'] as const,
    },
  ],
  health: 'Son 3 saatte hata yok',
  healthHint: 'Tüm sistemler düzgün çalışıyor',
  logsCta: 'Teknik logları gör',
  allowTitle: 'Beyaz Listeler',
  denyTitle: 'Kara Listeler',
  allowHint: 'Listedeki plaka bariyerden geçer, ödeme sorulmaz.',
  denyHint: 'Listedeki plaka sahaya alınmaz; operatör uyarılır.',
  plateLabel: 'Plaka',
  noteLabel: 'Not (isteğe bağlı)',
  platePlaceholder: '34 ABC 123',
  addAllow: 'Beyaz listeye ekle',
  addDeny: 'Kara listeye ekle',
  empty: 'Kayıt yok.',
  remove: 'Kaldır',
  invalid: 'Geçerli bir Türkiye plakası yazın.',
  duplicate: 'Bu plaka zaten listede.',
  addedAllow: 'Beyaz listeye eklendi.',
  addedDeny: 'Kara listeye eklendi.',
}

export const seedAllow: ZonePlate[] = [
  { id: 'a1', plate: '34 PBB 261', note: 'Yönetim' },
  { id: 'a2', plate: '06 VS 2018', note: 'Abone' },
]

export const seedDeny: ZonePlate[] = [{ id: 'd1', plate: '35 XXX 001', note: 'Kaçak geçiş' }]

export const demoTables: Record<Exclude<ZonePage, 'panel' | 'allow' | 'deny'>, DemoTable> = {
  inside: {
    title: 'İçerideki Araçlar',
    hint: 'Sahada şu an bulunan oturumlar.',
    columns: ['Plaka', 'Giriş', 'Süre', 'Durum'],
    rows: [
      { cells: ['34 PBB 261', '18:12', '2s 14dk', 'Abone'], tone: 'ok' },
      { cells: ['16 KR 448', '20:41', '23dk', 'Ödeme bekleniyor'], tone: 'warn' },
      { cells: ['06 VS 2018', '09:04', '11s 02dk', 'Abone'], tone: 'ok' },
    ],
  },
  hgs: {
    title: 'HGS Onayı',
    hint: 'HGS’den gelen geçişler operatör onayı bekler.',
    columns: ['Plaka', 'Kapı', 'Tutar', 'Durum'],
    rows: [
      { cells: ['34 ABC 118', 'Giriş 1', '80 TL', 'Onay bekliyor'], tone: 'warn' },
      { cells: ['07 TR 4421', 'Çıkış 2', '120 TL', 'Onaylandı'], tone: 'ok' },
    ],
  },
  settings: {
    title: 'Ayarlar',
    hint: 'Saha ve geçiş kuralları.',
    columns: ['Ayar', 'Değer'],
    rows: [
      { cells: ['Saha adı', 'TOGER · Merkez'] },
      { cells: ['Ücretlendirme', 'Süre bazlı'] },
      { cells: ['HGS', 'Açık'] },
      { cells: ['Otomatik bariyer', 'Açık'] },
    ],
  },
  sessions: {
    title: 'Oturumlar',
    hint: 'Giriş, çıkış, süre ve ödeme aynı tabloda.',
    columns: ['Plaka', 'Giriş', 'Çıkış', 'Ücret', 'Ödeme'],
    rows: [
      { cells: ['34 PBB 261', '18:12', '—', '—', 'Abone'], tone: 'ok' },
      { cells: ['16 KR 448', '20:41', '—', '80 TL', 'Bekliyor'], tone: 'warn' },
      { cells: ['35 XXX 001', '21:01', '21:01', '0 TL', 'Reddedildi'], tone: 'bad' },
      { cells: ['34 ABC 002', '13:43', '17:43', '120 TL', 'Ödendi'], tone: 'ok' },
    ],
  },
  photos: {
    title: 'Plaka Fotoları',
    hint: 'Kamera kareleri oturumla eşleşir.',
    columns: ['Plaka', 'Kapı', 'Saat', 'Güven'],
    rows: [
      { cells: ['34 PBB 261', 'Giriş 1', '18:12', '%99'] },
      { cells: ['16 KR 448', 'Giriş 2', '20:41', '%97'] },
      { cells: ['35 XXX 001', 'Giriş 1', '21:01', '%94'] },
    ],
  },
  payments: {
    title: 'Ödemeler',
    hint: 'HGS, POS ve QR tahsilatları.',
    columns: ['Plaka', 'Kanal', 'Tutar', 'Saat'],
    rows: [
      { cells: ['34 ABC 002', 'HGS', '120 TL', '17:43'] },
      { cells: ['41 PN 90', 'POS', '80 TL', '16:11'] },
      { cells: ['06 VS 2018', 'Abonelik', '1.450 TL', '09:02'] },
    ],
  },
  debt: {
    title: 'Borç Sorgulama',
    hint: 'Ödenmemiş oturum ve abone bakiyesi.',
    columns: ['Plaka', 'Tür', 'Tutar', 'Durum'],
    rows: [
      { cells: ['16 KR 448', 'Oturum', '80 TL', 'Açık'], tone: 'warn' },
      { cells: ['34 ZK 771', 'Abone', '450 TL', 'Gecikmiş'], tone: 'bad' },
    ],
  },
  tariffs: {
    title: 'Fiyat Tarifeleri',
    hint: 'Merkez saha · otomobil.',
    columns: ['Dilim', 'Ücret'],
    rows: [
      { cells: ['0–1 saat', '80 TL'] },
      { cells: ['1–3 saat', '120 TL'] },
      { cells: ['3–12 saat', '180 TL'] },
      { cells: ['Günlük tavan', '250 TL'] },
    ],
  },
  paySettings: {
    title: 'Ödeme Ayarları',
    hint: 'Tahsilat kanalları ve entegrasyonlar.',
    columns: ['Kanal', 'Durum'],
    rows: [
      { cells: ['HGS', 'Açık'], tone: 'ok' },
      { cells: ['POS', 'Açık'], tone: 'ok' },
      { cells: ['QR', 'Açık'], tone: 'ok' },
      { cells: ['e-Fatura', 'Açık'], tone: 'ok' },
    ],
  },
  report: {
    title: 'Finansal Rapor',
    hint: 'Bugünkü özet · demo rakamlar.',
    columns: ['Kalem', 'Tutar'],
    rows: [
      { cells: ['Nakit / POS', '4.820 TL'] },
      { cells: ['HGS', '6.140 TL'] },
      { cells: ['Abonelik', '12.300 TL'] },
      { cells: ['Toplam', '23.260 TL'] },
    ],
  },
  packages: {
    title: 'Abone Paketleri',
    hint: 'Aylık ve kurumsal tarifeler.',
    columns: ['Paket', 'Süre', 'Ücret', 'Aktif'],
    rows: [
      { cells: ['Aylık bireysel', '30 gün', '1.450 TL', '84'] },
      { cells: ['Kurumsal 10', '30 gün', '11.000 TL', '6'] },
      { cells: ['Personel', 'Süresiz', '0 TL', '12'] },
    ],
  },
  subscribers: {
    title: 'Aboneler',
    hint: 'Aktif abonelik kayıtları.',
    columns: ['Ad', 'Plaka', 'Paket', 'Bitiş'],
    rows: [
      { cells: ['Yönetim', '34 PBB 261', 'Personel', 'Süresiz'] },
      { cells: ['Visiosoft', '06 VS 2018', 'Aylık bireysel', '12.10.2026'] },
      { cells: ['Filo A', '07 TR 4421', 'Kurumsal 10', '01.10.2026'] },
    ],
  },
  barriers: {
    title: 'Kamera & Bariyer',
    hint: 'Giriş-çıkış eşleşmeleri.',
    columns: ['Nokta', 'Kamera', 'Bariyer', 'Durum'],
    rows: [
      { cells: ['Giriş 1', 'CAM-01', 'BAR-01', 'Çevrimiçi'], tone: 'ok' },
      { cells: ['Giriş 2', 'CAM-02', 'BAR-02', 'Çevrimiçi'], tone: 'ok' },
      { cells: ['Çıkış 1', 'CAM-03', 'BAR-03', 'Çevrimiçi'], tone: 'ok' },
    ],
  },
  pmp: {
    title: 'PMP Logları',
    hint: 'Cihaz ve kiosk olayları.',
    columns: ['Saat', 'Cihaz', 'Olay'],
    rows: [
      { cells: ['21:04', 'Kiosk-1', 'Ödeme tamamlandı'] },
      { cells: ['20:41', 'CAM-02', 'Plaka okundu'] },
      { cells: ['20:12', 'BAR-01', 'Bariyer açıldı'] },
    ],
  },
  devices: {
    title: 'Cihazlar',
    hint: 'Sahadaki üniteler.',
    columns: ['Cihaz', 'Tip', 'Durum'],
    rows: [
      { cells: ['Kiosk-1', 'Kiosk', 'Çevrimiçi'], tone: 'ok' },
      { cells: ['Validator-1', 'HGS', 'Çevrimiçi'], tone: 'ok' },
      { cells: ['POS-2', 'POS', 'Beklemede'], tone: 'warn' },
    ],
  },
  cameras: {
    title: 'Kameralar',
    hint: 'Plaka tanıma kameraları.',
    columns: ['Kamera', 'Konum', 'FPS', 'Durum'],
    rows: [
      { cells: ['CAM-01', 'Giriş 1', '25', 'Çevrimiçi'], tone: 'ok' },
      { cells: ['CAM-02', 'Giriş 2', '25', 'Çevrimiçi'], tone: 'ok' },
      { cells: ['CAM-03', 'Çıkış 1', '25', 'Çevrimiçi'], tone: 'ok' },
    ],
  },
}

export const pageLabels: Record<ZonePage, string> = {
  panel: zoneMiniCopy.panelNav,
  inside: 'İçerideki Araçlar',
  hgs: 'HGS Onayı',
  settings: 'Ayarlar',
  sessions: 'Oturumlar',
  photos: 'Plaka Fotoları',
  allow: zoneMiniCopy.allowTitle,
  deny: zoneMiniCopy.denyTitle,
  payments: 'Ödemeler',
  debt: 'Borç Sorgulama',
  tariffs: 'Fiyat Tarifeleri',
  paySettings: 'Ödeme Ayarları',
  report: 'Finansal Rapor',
  packages: 'Abone Paketleri',
  subscribers: 'Aboneler',
  barriers: 'Kamera & Bariyer',
  pmp: 'PMP Logları',
  devices: 'Cihazlar',
  cameras: 'Kameralar',
}
