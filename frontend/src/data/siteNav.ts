
export type NavIcon = 'cloud' | 'code' | 'network' | 'street' | 'building' | 'ticket' | 'hgs' | 'eye' | 'led' | 'report'

export type NavImage = {
  webp: string
  avif: string
  width: number
  height: number

  fit: number
}

export type NavMenuLink = {
  route: string
  label: string
  description: string

  placement?: 'card' | 'accessory'
  image?: NavImage
  icon?: NavIcon
}

export type NavItem = {
  key: string
  label: string
  route: string
  menu?: NavMenuLink[]
}

const navImage = (slug: string, width: number, height: number, fit = 1): NavImage => ({
  webp: `/img/nav/${slug}.webp`,
  avif: `/img/nav/${slug}.avif`,
  width,
  height,
  fit,
})

export const hardwareMenu: NavMenuLink[] = [
  {
    route: 'hardware-products.kiosk',
    label: 'Ödeme Kiosku',
    description: 'İnsansız ödeme',
    placement: 'card',
    image: navImage('kiosk', 86, 300),
  },
  {
    route: 'hardware-products.tir-kiosk',
    label: 'TIR Ödeme Kiosku',
    description: 'Ağır vasıta çözümü',
    placement: 'card',
    image: navImage('tir-kiosk', 62, 300),
  },
  {
    route: 'hardware-products.kamera-muhafaza',
    label: 'Visio Kamera',
    description: 'Plaka tanıma kamera muhafazası',
    placement: 'card',
    image: navImage('kamera-muhafaza', 400, 176, 0.78),
  },
  {
    route: 'hardware-products.visiobox',
    label: 'Visiobox',
    description: 'Bariyer kontrol ünitesi',
    placement: 'card',
    image: navImage('visiobox', 400, 296, 0.72),
  },
  {
    route: 'hardware-products.ledli-reklam-paneli',
    label: 'LED Bilgilendirme Paneli',
    description: 'Ücret ve yönlendirme ekranı',
    placement: 'card',
    image: navImage('led-panel', 130, 300),
  },
  {
    route: 'hardware-products.rack-kabin',
    label: 'Rack Kabin',
    description: 'Saha ekipman kabini',
    placement: 'card',
    image: navImage('rack-kabin', 230, 300, 0.88),
  },
  {
    route: 'hardware-products.kamera-montaj-kulesi',
    label: 'Kamera Montaj Kulesi',
    description: 'Kamera direği ve montajı',
    placement: 'accessory',
  },
]

export const softwareMenu: NavMenuLink[] = [
  { route: 'end-to-end', label: 'Uçtan Uca Sistem', description: 'Hub & Spoke modeliyle merkezi yönetim', icon: 'network' },
  { route: 'website-pricing', label: 'Site Otopark Yönetimi', description: 'Bulut tabanlı site otopark yönetimi', icon: 'building' },
  { route: 'on-street', label: 'Yol Üstü Parklandırma', description: 'Kamera ve HGS ile cadde parkı', icon: 'street' },
  { route: 'hgs', label: 'HGS Ödeme Sistemi', description: 'HGS, POS ve QR ile insansız tahsilat', icon: 'hgs' },
  { route: 'parking-violations', label: 'İşgaliye ve Park Ceza', description: 'Hatalı park ve süre aşımı tespiti', icon: 'ticket' },
  { route: 'kus-bakisi', label: 'Kuş Bakışı Yönetim', description: 'Tüm sahayı tek ekrandan izleyin', icon: 'eye' },
  { route: 'parking-reports', label: 'Raporlar', description: 'Operasyon, finans ve abonelik raporları', icon: 'report' },
  { route: 'developers', label: 'Geliştiriciler', description: 'GATE SDK ve ZONE API', icon: 'code' },
]

export const primaryNav: NavItem[] = [
  { key: 'alpr', label: 'Plaka Tanıma', route: 'alpr.index' },
  { key: 'software', label: 'Park Yazılım', route: 'software-products', menu: softwareMenu },
  { key: 'hardware', label: 'Donanım', route: 'hardware-products', menu: hardwareMenu },
  { key: 'services', label: 'Hizmetlerimiz', route: 'services' },
]

export const navCta = {
  primary: { label: 'Demo ve Teklif Al', route: 'quote.index' },
  secondary: { label: 'Ücretsiz Keşif', route: 'discovery.show' },
  contact: { label: 'İletişim', route: 'contact' },
}

export type FooterGroup = { title: string; links: { route: string; label: string }[] }

export const footerGroups: FooterGroup[] = [
  {
    title: 'Donanım',
    links: [
      { route: 'hardware-products', label: 'Tüm donanımlar' },
      ...hardwareMenu.map(({ route, label }) => ({ route, label })),
    ],
  },
  {
    title: 'Yazılım ve çözümler',
    links: [
      { route: 'software-products', label: 'Park Yazılım' },
      { route: 'plate-recognition-system', label: 'Plaka Tanıma Sistemi' },
      { route: 'parking-software', label: 'Otopark Yazılımı' },
      { route: 'end-to-end', label: 'Uçtan Uca Sistem' },
      { route: 'on-street', label: 'Yol Üstü Parklandırma' },
      { route: 'parking-violations', label: 'İşgaliye ve Park Ceza' },
      { route: 'hgs', label: 'HGS Ödeme' },
      { route: 'kus-bakisi', label: 'Kuş Bakışı Yönetim' },
      { route: 'parking-reports', label: 'Raporlar' },
      { route: 'mobil-abonelik', label: 'Mobil Abonelik' },
    ],
  },
  {
    title: 'Kurumsal',
    links: [
      { route: 'team', label: 'Hakkımızda' },
      { route: 'references', label: 'Referanslar' },
      { route: 'services', label: 'Hizmetlerimiz' },
      { route: 'comparison', label: 'Karşılaştırma' },
      { route: 'developers', label: 'Geliştiriciler' },
      { route: 'blog.index', label: 'Blog' },
      { route: 'contact', label: 'İletişim' },
    ],
  },
  {
    title: 'Destek',
    links: [
      { route: 'quote.index', label: 'Teklif Al' },
      { route: 'discovery.show', label: 'Ücretsiz Keşif' },
      { route: 'field-manual', label: 'Saha Kullanım Kılavuzu' },
      { route: 'glossary', label: 'Otopark Terimleri' },
      { route: 'bank-accounts', label: 'Banka Hesapları' },
      { route: 'sitemap', label: 'Site Haritası' },
    ],
  },
]

export const legalLinks = [
  { route: 'legal.privacy', label: 'Gizlilik Politikası' },
  { route: 'legal.distance-sales', label: 'Mesafeli Satış Sözleşmesi' },
  { route: 'legal.return-policy', label: 'İade Politikası' },
]
