import type { ParkingFlowDevice, ParkingFlowStep, ParkingFlowStepId } from '../../components/ParkingFlow/index.ts'
import type { FeatureIconName } from '../../components/FeatureGrid/index.ts'

export type MethodKey = 'hgs' | 'pos' | 'qr'

export type PaymentMethod = {
  key: MethodKey
  label: string
  title: string
  description: string
  route: string[]
  step: ParkingFlowStepId
  device: ParkingFlowDevice
  deviceLabel: string
}

export type SectorIconName = 'mall' | 'home' | 'hospital' | 'city' | 'brief' | 'truck'
export type MethodIconName = 'hgs' | 'card' | 'qr' | 'building'
export type AdvantageIconName = 'gauge' | 'users' | 'shield' | 'chart'

const methods: PaymentMethod[] = [
  {
    key: 'hgs',
    label: 'HGS',
    title: 'HGS ile otomatik tahsilat',
    description: 'Etiketli araçlar için ilk tercih otomatik tahsilat.',
    route: ['Plaka ve HGS verisi eşleşir', 'Ödeme manuel işlem olmadan tamamlanır', 'Bariyer açılır'],
    step: 'verify',
    device: 'controlBox',
    deviceLabel: 'Kontrol kutusu · HGS',
  },
  {
    key: 'pos',
    label: 'POS',
    title: 'POS ve temassız kart',
    description: 'HGS bakiyesi yoksa kart veya temassız yedek ödeme.',
    route: ['HGS uygun değilse kiosk devreye girer', 'Sürücü kart ile işlemi tamamlar', 'Bariyer açılır'],
    step: 'pay',
    device: 'kiosk',
    deviceLabel: 'Kiosk · POS',
  },
  {
    key: 'qr',
    label: 'QR',
    title: 'QR ve mobil ödeme',
    description: 'Sürücünün telefonundan tamamlanan mobil ödeme akışı.',
    route: ['Sürücü cep telefonundan öder', 'Sonuç operatör paneline düşer', 'Bariyer açılır'],
    step: 'open',
    device: 'barrier',
    deviceLabel: 'Bariyer · QR',
  },
]

/*
 * Sahne adımları yöntemlerle bire bir eşleşir (verify → HGS, pay → POS, open → QR). Adım etiketleri sahnede gizlidir
 * (showLabels=false, yalnızca ekran okuyucu); seçim yöntem kutucuklarından yapılır. Cihaz etiketleri kısa tutulur ki
 * 390px sahnede de cihazların üstünü kapatmasın.
 */
const flowSteps: ParkingFlowStep[] = methods.map((method) => ({
  id: method.step,
  title: method.title,
  description: method.deviceLabel,
}))

export const hgsPageCopy = {
  seo: {
    title: 'HGS ile İnsansız Otopark Sistemi | Visiosoft',
    description:
      'HGS, POS, QR ve canlı raporlama ile insansız otopark akışı kurun. Geçişleri hızlandırın, geliri koruyun, personel maliyetini düşürün.',
  },
  hero: {
    eyebrow: 'HGS ile insansız otopark',
    title: ['Maksimum gelir.', 'Minimum bekleme.'],
    lead: 'Araçları HGS ile tanıyın, ödemeyi otomatik alın, gerektiğinde POS veya QR senaryosuna geçin. Tüm otopark akışını tek kontrol katmanından yönetin.',
    primary: 'Teklif Al',
    secondary: 'Ücretsiz Keşif',
    outcomesLabel: 'Sonuçlar',
    outcomes: ['Bekleme yok', 'Sabit gişe bağımlılığı yok', 'Tahsilatta kör nokta yok'],
    factsLabel: 'Öne çıkanlar',
    stackLabel: 'HGS / POS / QR',
    facts: [
      { value: 'Tek Panel', label: 'Geçiş, ödeme ve istisna yönetimi birlikte' },
      { value: '7/24', label: 'Uzaktan izleme ve müdahale hazır' },
      { value: 'Nakit Yok', label: 'İnsansız işletime uygun kurgu' },
    ],
    highlights: ['Temassız giriş ve çıkış', 'HGS + POS + QR ödeme akışı', 'Gelir kaybı riskini azaltın'],
  },
  matrix: {
    id: 'odeme-matrisi',
    eyebrow: 'HGS + POS + QR',
    title: 'Ödeme matrisi',
    lead: 'HGS en hızlı kanalınız olsun, ama tek kanalınız olmasın. Bir yöntemi seçin; akıştaki yeri sahnede vurgulanır.',
    groupLabel: 'Ödeme yöntemi seçin',
    routeLabel: 'Akıştaki yeri',
    sceneLabel: 'Seçilen ödeme yönteminin otopark akışındaki yeri',
    caption: 'Temsilî akış çizimi',
    methods,
    flowSteps,
  },
  subNav: [
    { id: 'yontemler', label: 'Ödeme yöntemleri' },
    { id: 'avantajlar', label: 'Avantajlar' },
    { id: 'nasil-calisir', label: 'Nasıl çalışır?' },
    { id: 'sektorler', label: 'Kimler için' },
  ],
  methods: {
    id: 'yontemler',
    eyebrow: 'Yedekli tahsilat',
    title: 'Ödeme yöntemlerini tek bir insansız akışta birleştirin',
    lead: 'Güçlü bir otopark deneyimi, farklı ödeme senaryolarını aynı operasyon içinde yedekli şekilde yürütür. Abonelik ve filo geçişleri de aynı kurallarla, aynı panelden yönetilir.',
    label: 'Ödeme yöntemleri',
    items: [
      { icon: 'hgs', title: 'HGS ile otomatik tahsilat', description: 'HGS etiketi olan araçlar anında tanınır, manuel işlem olmadan ödeme tamamlanır.' },
      { icon: 'card', title: 'POS ve temassız kart', description: 'HGS uygun değilse sürücü kiosk veya çıkış noktasında kart ile işlemi tamamlar.' },
      { icon: 'qr', title: 'QR ve mobil ödeme', description: 'Sürücü cep telefonundan öder, sonuç operatör paneline ve raporlara anında düşer.' },
      { icon: 'building', title: 'Abonelik ve filolar', description: 'Site sakinleri, personel, kiracılar ve kurumsal filolar için kurallı geçiş ve toplu faturalama yönetilir.' },
    ] satisfies { icon: MethodIconName; title: string; description: string }[],
  },
  advantages: {
    id: 'avantajlar',
    eyebrow: 'Neden HGS',
    title: 'HGS insansız otoparkta neden fark yaratır?',
    lead: 'HGS katmanı sadece bariyeri hızlandırmaz; gelir operasyonundaki manuel yükü, itirazları ve işlem süresini de azaltır.',
    label: 'HGS avantajları',
    items: [
      { icon: 'gauge', title: 'Daha hızlı araç akışı', description: 'Yoğun saatlerde dur-kalkı azaltır, aynı şeritten daha fazla araç geçirmenizi sağlar.' },
      { icon: 'users', title: 'Daha düşük personel yükü', description: 'Sürekli gişe personeli ihtiyacını azaltır, ekibi sadece istisna yönetimine yönlendirir.' },
      { icon: 'shield', title: 'Geliri koruyan akış', description: 'Her geçiş kayıt altına alınır; HGS başarısızsa sistem başka ödeme kanalına yönlendirir.' },
      { icon: 'chart', title: 'Yönetilebilir raporlama', description: 'Tahsilatı ödeme tipine, tarihe, bariyere ve istisnaya göre tek panelden analiz edin.' },
    ] satisfies { icon: AdvantageIconName; title: string; description: string }[],
    image: {
      src: '/img/software/zone-sessions.webp',
      avif: '/img/software/zone-sessions.avif',
      width: 1024,
      height: 576,
      alt: 'Zone yönetim panelinde oturumlar tablosu: plaka, giriş ve çıkış saati, süre, ücret ve ödeme durumu sütunları',
      caption: 'Zone oturumlar ekranı — demo verisi',
      chips: [{ label: 'Ödeme durumu' }, { label: 'Tek panel' }],
    },
  },
  flow: {
    id: 'nasil-calisir',
    eyebrow: 'Dört adım',
    title: 'Nasıl çalışır?',
    lead: 'Girişte ya da çıkışta araç tanınır, doğru ödeme senaryosu seçilir, tahsilat raporlara işlenir ve bariyer açılır.',
    label: 'HGS tahsilat adımları',
    steps: [
      { icon: 'plate', title: 'Araç tanıma', description: 'HGS ve plaka verisi girişte veya çıkışta eşleştirilir.' },
      { icon: 'settings', title: 'Senaryo seçimi', description: 'Sistem HGS, POS, QR veya abonelik mantığını otomatik belirler.' },
      { icon: 'report', title: 'Tahsilat', description: 'Ödeme alınır ve işlem canlı raporlara anında işlenir.' },
      { icon: 'barrier', title: 'Bariyer açılışı', description: 'Bariyer açılır, istisnalar uzaktan takip için görünür kalır.' },
    ] satisfies { icon: FeatureIconName; title: string; description: string }[],
  },
  sectors: {
    id: 'sektorler',
    eyebrow: 'Kullanım alanları',
    title: 'Kimler için ideal?',
    label: 'Uygun otopark türleri',
    items: [
      { icon: 'mall', title: 'AVM otoparkları', description: 'Alışveriş merkezlerinde hızlı ve temassız ödeme deneyimi.' },
      { icon: 'home', title: 'Site ve rezidanslar', description: 'Site sakinleri için kurallı geçiş ve toplu faturalama yönetilir.' },
      { icon: 'hospital', title: 'Hastane ve kampüsler', description: 'Sağlık kurumlarında kesintisiz ve pratik otopark yönetimi.' },
      { icon: 'city', title: 'Belediye otoparkları', description: 'Resmi otoparklarda şeffaf ve güvenilir tahsilat sistemi.' },
      { icon: 'brief', title: 'İş merkezleri', description: 'Personel, kiracılar ve kurumsal filolar için kurallı geçiş yönetilir.' },
      { icon: 'truck', title: 'Ticari otopark işletmeleri', description: 'Yoğun giriş-çıkışlarda HGS, POS ve QR tahsilatını tek panelden izleyin.' },
    ] satisfies { icon: SectorIconName; title: string; description: string }[],
  },
  cta: {
    eyebrow: 'HGS merkezli otopark',
    title: 'Otoparkınızı HGS merkezli insansız sisteme dönüştürmeye hazır mısınız?',
    description: 'HGS, POS, QR, kiosk, bariyer ve raporlama katmanlarını trafik modelinize göre birlikte kurgulayalım.',
    primary: 'Teklif Al',
    secondary: 'İletişim',
  },
}
