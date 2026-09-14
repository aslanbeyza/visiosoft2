import type { ParkingFlowStepId } from './scene.ts'

export type ParkingFlowDevice = 'camera' | 'kiosk' | 'barrier' | 'controlBox' | 'ledPanel' | 'pole'

export const parkingFlowCopy = {
  sceneLabel: 'Otopark geçiş akışı',
  sceneDescription:
    'Şerit üzerinde ilerleyen araç, direkteki plaka tanıma kamerası ve kontrol kutusu, LED bilgi paneli, ödeme kioskı ve bariyer kolu.',
  stepsLabel: 'Akış adımları',
  pause: 'Animasyonu duraklat',
  play: 'Animasyonu oynat',
  pauseShort: 'Duraklat',
  playShort: 'Oynat',
  highlightPrefix: 'Vurgulanan cihaz',
  devices: {
    camera: 'Plaka tanıma kamerası',
    kiosk: 'Ödeme kioskı',
    barrier: 'Bariyer',
    controlBox: 'Kontrol kutusu',
    ledPanel: 'LED bilgi paneli',
    pole: 'Kamera montaj direği',
  } satisfies Record<ParkingFlowDevice, string>,
} as const

/** Sayfaların doğrudan kullanabileceği varsayılan beş adım. */
export const parkingFlowSteps: { id: ParkingFlowStepId; title: string; description: string }[] = [
  { id: 'approach', title: 'Araç yaklaşır', description: 'Araç giriş ya da çıkış şeridine girer; sistem plakayı okumaya hazırdır.' },
  { id: 'detect', title: 'Plaka okunur', description: 'Direkteki kamera plakayı tanır; plaka girişi ya da etiket gerekmez.' },
  { id: 'verify', title: 'Kayıt doğrulanır', description: 'Kontrol kutusu plakayı abone, beyaz/kara liste ve HGS kayıtlarıyla eşler.' },
  { id: 'pay', title: 'Ödeme alınır', description: 'Ücret kioskta görünür; HGS, banka kartı (POS) ya da QR ile tahsilat tamamlanır.' },
  { id: 'open', title: 'Bariyer açılır', description: 'İşlemi tamamlanan araç için bariyer kolu kalkar, geçiş kayda geçer.' },
]
