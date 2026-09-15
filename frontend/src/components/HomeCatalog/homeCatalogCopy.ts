export type CatalogKind = 'product' | 'screen' | 'phone'

export type CatalogItem = {
  name: string
  text: string
  route: string
  kind: CatalogKind
  shape?: 'tall'
  image: {
    src: string
    avif?: string
    width: number
    height: number
    alt: string
  }
}

export type CatalogTab = {
  id: 'solutions' | 'software'
  label: string
  title: string
  more: { label: string; route: string }
  items: readonly CatalogItem[]
}

/** Parklio’daki Solutions / Software vitrininin Visiosoft örneği. */
export const homeCatalogCopy = {
  titleId: 'katalog-title',
  tablistLabel: 'Çözüm ve yazılım vitrini',
  panelLabel: 'Vitrin ürünleri',
  tabs: [
    {
      id: 'solutions',
      label: 'Çözümler',
      title: 'Otopark yönetimini Visiosoft çözümleriyle sadeleştirin.',
      more: { label: 'Tüm donanımları görün', route: 'hardware-products' },
      items: [
        {
          name: 'Visio Kamera',
          text: 'Giriş ve çıkışta plakayı okur; sürücü bilet almadan geçer.',
          route: 'hardware-products.kamera-muhafaza',
          kind: 'product',
          image: {
            src: '/img/home/products/kamera-muhafaza.webp',
            avif: '/img/home/products/kamera-muhafaza.avif',
            width: 804,
            height: 352,
            alt: 'Visio Kamera: plaka tanıma kamerası için dış ortam muhafazası',
          },
        },
        {
          name: 'Ödeme Kiosku',
          text: 'Plakayı eşler, ücreti gösterir ve temassız ödeme ile çıkışı tamamlar.',
          route: 'hardware-products.kiosk',
          kind: 'product',
          shape: 'tall',
          image: {
            src: '/img/home/kiosk/kiosk-2064.webp',
            avif: '/img/home/kiosk/kiosk-2064.avif',
            width: 545,
            height: 2064,
            alt: 'Visiosoft çıkış ödeme kiosku',
          },
        },
        {
          name: 'Visiobox',
          text: 'Bariyer ve saha cihazlarını tek kutuda toplar; şerit kontrolü yerinde çalışır.',
          route: 'hardware-products.visiobox',
          kind: 'product',
          image: {
            src: '/img/home/products/visiobox.webp',
            avif: '/img/home/products/visiobox.avif',
            width: 744,
            height: 549,
            alt: 'Visiobox kontrol kutusu',
          },
        },
      ],
    },
    {
      id: 'software',
      label: 'Yazılım',
      title: 'Sahayı, tahsilatı ve sürücüyü tek yazılımda yönetin.',
      more: { label: 'Yazılım ürünlerini inceleyin', route: 'software-products' },
      items: [
        {
          name: 'Zone',
          text: 'Oturum, tahsilat, abonelik ve cihazlar tek panelden yönetilir.',
          route: 'parking-software',
          kind: 'screen',
          image: {
            src: '/img/software/sessions-table.webp',
            avif: '/img/software/sessions-table.avif',
            width: 996,
            height: 436,
            alt: 'Zone oturumlar tablosu: plaka, giriş-çıkış, süre, ücret ve ödeme durumu',
          },
        },
        {
          name: 'Plaka Tanıma',
          text: 'Kamera plakayı okur, geçiş otomatik başlar; kayıt Zone\'a işlenir.',
          route: 'plate-recognition-system',
          kind: 'screen',
          image: {
            src: '/img/software/map-detail.webp',
            avif: '/img/software/map-detail.avif',
            width: 900,
            height: 560,
            alt: 'Zone canlı haritadan yakın görünüm: park yerleri ve kamera konumları',
          },
        },
        {
          name: 'ParkBiz',
          text: 'Sürücü otoparkı bulur, borcunu öder ve aboneliğini telefondan alır.',
          route: 'mobil-abonelik',
          kind: 'phone',
          image: {
            src: '/img/app/otoparklar.webp',
            avif: '/img/app/otoparklar.avif',
            width: 780,
            height: 1692,
            alt: 'ParkBiz uygulamasında yakındaki otoparklar listesi',
          },
        },
      ],
    },
  ] satisfies CatalogTab[],
} as const
