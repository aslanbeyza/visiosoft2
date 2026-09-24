import type { ParkingFlowStep } from '../../components/ParkingFlow/index.ts'

export type PlateCondition = 'gece' | 'yagmur' | 'kar' | 'sis' | 'camur'

export const plakaCopy = {
  seo: {
    title: 'Plaka Tanıma Sistemi | %99 Üzeri Doğruluk | Visiosoft',
    description:
      '6.500.000+ gerçek saha fotoğrafıyla eğitilmiş yapay zeka. Kar, yağmur, sis veya gece fark etmez: zorlu koşullarda bile %99 üzeri doğruluk.',
  },
  hero: {
    eyebrow: 'Plaka Tanıma',
    title: ['Kusursuz', 'tanıma.'],
    lead: 'Zorlu koşullarda bile %99 üzeri doğruluk. Araç yaklaşır, kamera plakayı okur, kayıt doğrulanır ve bariyer açılır.',
    flowLabel: 'Plaka tanıma ile otopark geçiş akışı',
  },
  flowSteps: [
    { id: 'approach', title: 'Araç yaklaşır', description: 'Araç şeride girer; kamera plakayı okumaya hazırdır.' },
    { id: 'detect', title: 'Plaka okunur', description: 'Kamera plakayı görür ve tanır; plaka girişi gerekmez.' },
    { id: 'verify', title: 'Kayıt doğrulanır', description: 'Plaka abone, beyaz/kara liste ve HGS kayıtlarıyla eşlenir.' },
    { id: 'pay', title: 'Ödeme alınır', description: 'HGS, banka kartı (POS) ya da QR ile tahsilat tamamlanır.' },
    { id: 'open', title: 'Bariyer açılır', description: 'Bariyer kalkar, geçiş kayda geçer.' },
  ] satisfies ParkingFlowStep[],
  scan: {
    eyebrow: 'Zorlu koşullar',
    title: 'Gerçek saha başarısı',
    lead: 'Kar, yağmur, çamur, sis veya gece karanlığı fark etmez. Sistemimiz zorlu koşullarda da plakayı görür, tanır ve onaylar.',
    legend: 'Koşul seçin',
    conditions: [
      { id: 'gece', label: 'Gece' },
      { id: 'yagmur', label: 'Yağmur' },
      { id: 'kar', label: 'Kar' },
      { id: 'sis', label: 'Sis' },
      { id: 'camur', label: 'Çamur' },
    ] satisfies { id: PlateCondition; label: string }[],
    phases: ['Görür', 'Tanır', 'Onaylar'],
    accuracy: '%99 üzeri doğruluk',
    plateText: '34 ••• ••',
    figureLabel: 'Plaka okuma çizimi',
    figureDescription: (condition: string) =>
      `${condition} koşulunda kamera görüntüsündeki plaka bulunur, karakterler okunur ve kayıt onaylanır.`,
    note: 'Temsilî çizim; plaka karakterleri gizlenmiştir.',
  },
  speed: {
    eyebrow: 'Performans',
    title: 'Hız, edge işleme ve düşük tüketim.',
    lead: 'Tanıma süresi, sahadaki işlem kutusu ve enerji — otopark girişinde akışı belirleyen üç somut değer.',
    items: [
      {
        meta: '100 ms',
        title: 'Bekleme yok, kuyruk oluşmaz',
        description:
          'Tanıma anında biter; bariyer kararı gecikmez. Yoğun giriş–çıkışta akış durmaz.',
      },
      {
        meta: 'Edge',
        title: 'Tek kutuda 4 kamera',
        description:
          'Jetson Orin Nano ile görüntü işleme sahadaki kutuda kalır; ayrı PC ve kablo yığını gerekmez.',
      },
      {
        meta: '15 W',
        title: 'Düşük işletme maliyeti',
        description: '7/24 açık otoparklarda ampul seviyesinde tüketim; soğutma ve elektrik faturası hafifler.',
      },
    ],
    basariLink: {
      label: 'Zorlu hava ve gece koşulları → Başarı bölümü',
      href: '#basari',
    },
  },
  tech: {
    eyebrow: 'Teknoloji',
    title: 'Sahadan öğrenen yapay zeka.',
    statement:
      'Visiosoft Plaka Tanıma Sistemi yalnızca bir kamera değil; derin öğrenme algoritmalarıyla sürekli geliştirilen bir yapay zeka ekosistemidir.',
    note: 'Yapay zeka modelimiz, Türkiye ve dünya genelinden toplanan 6.500.000+ gerçek saha fotoğrafıyla eğitildi.',
    statsLabel: 'Plaka tanıma sistemi değerleri',
    stats: [
      { value: 6.5, decimals: 1, suffix: ' M+', label: 'Eğitim fotoğrafı' },
      { value: '%99 üzeri', label: 'Doğruluk' },
      { value: 0.1, decimals: 1, suffix: ' sn', label: 'Tepki süresi' },
      { value: '7/24', label: 'Kesintisiz' },
    ],
  },
  saha: {
    eyebrow: 'Saha',
    title: 'Sahada plaka tanımayı taşıyan donanım',
    lead: 'Kamera doğru yükseklikte ve korunaklı konumlandığında plaka net görünür.',
    cardsLabel: 'Plaka tanıma donanımı',
    guidesLabel: 'Plaka tanıma rehberleri',
    action: 'İncele',
    // products.ts → copy.eyebrow / copy.name / copy.lead
    products: [
      {
        eyebrow: 'Koruma Donanımı',
        name: 'Visio Kamera',
        lead: 'Kameraları dış koşullara karşı koruyan, kompakt ve sağlam muhafaza.',
      },
      {
        eyebrow: 'Montaj Sistemleri',
        name: 'Visio Kamera Montaj Kulesi',
        lead: 'Kameraları yüksekten konumlandırmak için modüler ve dayanıklı montaj kulesi.',
      },
    ],
    guides: [
      {
        eyebrow: 'Rehber',
        title: 'Plaka tanıma sistemi nedir?',
        description: 'Plaka tanımanın nasıl çalıştığını ve otoparkta neleri değiştirdiğini adım adım inceleyin.',
      },
      {
        eyebrow: 'Anahtar teslim',
        title: 'Plaka tanıma çözümü',
        description: 'Kamera, yazılım ve tahsilatın tek projede nasıl bir araya geldiğini görün.',
      },
    ],
  },
}
