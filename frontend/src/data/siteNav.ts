/**
 * Sitenin tek bilgi mimarisi kaynağı. Navbar, Footer (ve ileride Site Haritası) buradan okur.
 * Rotalar ad olarak tutulur; yol `usePath()(route)` ile üretilir.
 */

export type NavIcon = 'cloud' | 'code' | 'network' | 'street' | 'building' | 'ticket' | 'hgs' | 'eye' | 'led' | 'report'

export type NavMenuLink = {
  route: string
  label: string
  description: string
  /** Donanım menüsünde ürün görseli (arka planı ayrılmış WebP). */
  image?: string
  icon?: NavIcon
}

export type NavItem = {
  key: string
  label: string
  route: string
  menu?: NavMenuLink[]
}

const card = (slug: string) => `/img/products/cards/${slug}.webp`

export const hardwareMenu: NavMenuLink[] = [
  { route: 'hardware-products.kiosk', label: 'Kiosk', description: 'İnsansız çıkış ödeme kiosku', image: card('kiosk') },
  { route: 'hardware-products.tir-kiosk', label: 'TIR Kiosk', description: 'Ağır vasıta için iki katlı ödeme kiosku', image: card('tir-kiosk') },
  { route: 'hardware-products.visiobox', label: 'Visiobox', description: 'Bariyer ve sensörler için kontrol kutusu', image: card('visiobox') },
  { route: 'hardware-products.rack-kabin', label: 'Rack Kabin', description: 'Saha ekipmanları için kilitli kabin', image: card('rack-kabin') },
  { route: 'hardware-products.kamera-muhafaza', label: 'Kamera Muhafaza', description: 'Dış ortam kameraları için muhafaza', image: card('kamera-muhafaza') },
  { route: 'hardware-products.kamera-montaj-kulesi', label: 'Kamera Montaj Kulesi', description: 'Kameraları yüksekten konumlandırma', image: card('kamera-montaj-kulesi') },
  { route: 'hardware-products.ledli-reklam-paneli', label: 'Ledli Reklam Paneli', description: 'Giriş ve yönlendirme için LED panel', icon: 'led' },
]

export const softwareMenu: NavMenuLink[] = [
  { route: 'software-products', label: 'Park Yazılım', description: 'Tüm yazılım ürünleri', icon: 'cloud' },
  { route: 'end-to-end', label: 'Uçtan Uca Sistem', description: 'Hub & Spoke modeliyle merkezi yönetim', icon: 'network' },
  { route: 'website-pricing', label: 'Site Otopark Yönetimi', description: 'Bulut tabanlı site otopark yönetimi', icon: 'building' },
  { route: 'on-street', label: 'Yol Üstü Parklandırma', description: 'Kamera ve HGS ile cadde parkı', icon: 'street' },
  { route: 'hgs', label: 'HGS Ödeme Sistemi', description: 'HGS, POS ve QR ile insansız tahsilat', icon: 'hgs' },
  { route: 'parking-violations', label: 'İşgaliye ve Park Ceza', description: 'Hatalı park ve süre aşımı tespiti', icon: 'ticket' },
  { route: 'kus-bakisi', label: 'Kuş Bakışı Yönetim', description: 'Tüm sahayı tek ekrandan izleyin', icon: 'eye' },
  { route: 'developers', label: 'Geliştiriciler', description: 'GATE SDK ve ZONE API', icon: 'code' },
]

export const primaryNav: NavItem[] = [
  { key: 'alpr', label: 'Plaka Tanıma', route: 'alpr.index' },
  { key: 'software', label: 'Park Yazılım', route: 'software-products', menu: softwareMenu },
  { key: 'hardware', label: 'Donanım', route: 'hardware-products', menu: hardwareMenu },
  { key: 'services', label: 'Hizmetlerimiz', route: 'services' },
  { key: 'about', label: 'Hakkımızda', route: 'team' },
  { key: 'contact', label: 'İletişim', route: 'contact' },
]

export const navCta = {
  primary: { label: 'Teklif Al', route: 'quote.index' },
  secondary: { label: 'Ücretsiz Keşif', route: 'discovery.show' },
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
