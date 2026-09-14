import type { ParkingFlowStepId } from '../ParkingFlow/index.ts'

export type SystemFlowStep = {
  /** Sahnedeki poz; kayıt adımı sahnenin son (bariyer açık) pozunda kalır. */
  scene: ParkingFlowStepId
  title: string
  description: string
  chips?: string[]
}

/** Ana sayfa 4.3 "Sistem nasıl çalışır?" metinleri (HOME3.md §4.3, birebir). */
export const homeSystemFlowCopy = {
  titleId: 'sistem-title',
  eyebrow: 'Sistem nasıl çalışır?',
  title: 'Araç girişinden gelir raporuna tek akış.',
  lead: 'Kamera, ödeme noktası, bariyer ve Zone paneli aynı altyapıda çalışır; her adım kayda geçer.',
  stepsLabel: 'Sistem akışının adımları',
  sceneLabel: 'Geçiş akışı sahnesi',
  sceneDescription:
    'Şematik sahne: araç şeride girer, direkteki kamera plakayı okur, kontrol kutusu geçişi doğrular, kioskta ödeme tamamlanır ve bariyer açılır.',
  steps: [
    { scene: 'approach', title: 'Araç yaklaşır', description: 'Şeritteki kamera aracı algılar.' },
    {
      scene: 'detect',
      title: 'Plaka okunur',
      description: 'Plaka 100 ms altında tanınır; düşük güvenli okumalar operatör onayına düşer.',
    },
    {
      scene: 'verify',
      title: 'Geçiş doğrulanır',
      description:
        'Abonelik, beyaz/kara liste ve borç durumu anında kontrol edilir; bağlantı kesilse de sahadaki kontrolcü çalışmayı sürdürür.',
    },
    {
      scene: 'pay',
      title: 'Ödeme alınır',
      description: 'HGS, POS ya da QR ile temassız tahsilat; kioskta veya mobil uygulamada.',
      chips: ['HGS', 'POS', 'QR'],
    },
    {
      scene: 'open',
      title: 'Bariyer açılır',
      description: 'Onaylanan araç için bariyer komutu milisaniyeler içinde iletilir.',
    },
    {
      scene: 'open',
      title: 'Kayıt ve rapor',
      // ASCII kısa çizgi (sayfa içi arama ile eşleşir); satır bölünmesini FlowSteps engeller.
      description: "Geçiş, ödeme ve kamera kaydı Zone'a işlenir; e-fatura, e-arşiv ve gelir raporları hazır olur.",
    },
  ] satisfies SystemFlowStep[],
  sessions: {
    src: '/img/home/zone/sessions.webp',
    avif: '/img/home/zone/sessions.avif',
    width: 996,
    height: 436,
    alt: 'Zone oturumlar ekranı: otopark, plaka, giriş-çıkış saati, süre, ücret ve ödeme durumu sütunlarıyla geçiş kayıtları tablosu.',
    caption: 'Zone oturumlar ekranı · demo verisi',
  },
  links: {
    primary: { label: 'Uçtan uca sistemi inceleyin', route: 'end-to-end' },
    secondary: { label: 'HGS ile ödeme', route: 'hgs' },
  },
  pause: 'Akışı duraklat',
  play: 'Akışı oynat',
  pauseShort: 'Duraklat',
  playShort: 'Oynat',
  counterLabel: (index: number, total: number) => `Adım ${index} / ${total}`,
} as const
