import type { FeatureIconName } from '../../components/FeatureGrid/index.ts'

type IconItem = { icon: FeatureIconName; title: string; description: string; meta?: string }

export const servicesCopy = {
  seoTitle: 'Hizmetlerimiz - Visiosoft',
  seoDescription:
    'Keşif, kurulum, 7/24 destek ve bakım hizmetleri. Otopark işletmenizin tüm teknik ve operasyonel ihtiyaçları için yanınızdayız.',

  hero: {
    eyebrow: 'Hizmetlerimiz',
    title: ['Yanınızda', '7/24.'],
    lead: 'Saha ve müşteri destek ekiplerimizle tek bir muhatabınız var. İşimizi şansa bırakmayız.',
    pulseLabel: 'Hizmet ritmi',
    pause: 'Animasyonu duraklat',
    play: 'Animasyonu oynat',
  },

  subNav: [
    { id: 'kesif-kurulum', label: 'Keşif & Kurulum' },
    { id: 'destek', label: '7/24 Destek' },
    { id: 'uzaktan-izleme', label: 'Uzaktan İzleme' },
    { id: 'muhasebe', label: 'Resmi Muhasebe' },
  ],

  discovery: {
    eyebrow: 'Keşif & Kurulum',
    title: 'Keşif ve Kurulum.',
    lead: 'Mühendislerimiz alanınızı analiz eder, en verimli donanım yerleşimini planlar ve anahtar teslim kurulum yapar.',
    label: 'Keşiften desteğe hizmet adımları',
    steps: [
      { icon: 'map', title: 'Ücretsiz online keşif', description: 'Alanınız online görüşmede analiz edilir; giriş-çıkış noktaları ve ihtiyaçlarınız netleşir.' },
      { icon: 'settings', title: 'Yerleşim planı', description: 'Kamera, kiosk ve bariyer için en verimli donanım yerleşimi planlanır.' },
      { icon: 'barrier', title: 'Anahtar teslim kurulum', description: 'Donanım ve yazılım sahada kurulur, sisteminiz çalışır durumda teslim edilir.' },
      { icon: 'support', title: '7/24 destek', description: 'Saha ve müşteri destek ekiplerimiz kurulumdan sonra da yanınızdadır.' },
    ] as IconItem[],
  },

  support: {
    eyebrow: '7/24 Destek',
    title: 'Tek bir muhatabınız var.',
    lead: 'Sürücüden işletmeciye, sahadaki her soru aynı ekibe ulaşır.',
    label: 'Destek hizmetleri',
    items: [
      {
        icon: 'support',
        title: '7/24 Görüntülü Destek',
        description: 'Sürücüler için sesli ve görüntülü yardım asistanı. Gece gündüz her zaman yardım alabilirsiniz.',
        meta: '7/24',
      },
      { icon: 'users', title: 'Saha ekibi', description: 'Keşiften kuruluma, sahadaki her adımda aynı ekiple çalışırsınız.' },
      { icon: 'settings', title: 'Uzaktan müdahale', description: 'Gerekli olduğunda uzaktan müdahale edilerek akışın durmaması sağlanır.' },
      { icon: 'cloud', title: 'Otomatik güncelleme', description: 'Yeni özellikler ve güvenlik yamaları uzaktan uygulanır.' },
      { icon: 'phone', title: 'Mobil uygulama', description: 'iOS ve Android cihazlardan otoparkınızı yönetin, bildirimleri telefonunuzdan alın.' },
    ] as IconItem[],
  },

  monitoring: {
    eyebrow: 'Uzaktan İzleme',
    title: 'Kameraları canlı izleyin, ödemeyi uzaktan yönetin.',
    lead: 'Operasyon ekibimiz giriş, çıkış ve ödeme noktalarını tek ekranda takip eder. Gerekli olduğunda uzaktan müdahale ederek akışın durmamasını sağlar.',
    listLabel: 'Uzaktan izleme kapsamı',
    list: [
      'Canlı kamera: giriş ve çıkış noktalarını görün.',
      'Uzaktan ödeme kontrolü: ödeme noktasını uzaktan yönetin.',
      'Anlık durum takibi: sahadaki hareketi tek panelden izleyin.',
    ],
    board: {
      title: 'İzleme ekranı',
      note: 'Temsilî görünüm',
      camera: 'Giriş kamerası',
      pause: 'Taramayı duraklat',
      play: 'Taramayı başlat',
      rows: [
        { device: 'Giriş kamerası', status: 'Canlı' },
        { device: 'Çıkış kamerası', status: 'Canlı' },
        { device: 'Ödeme noktası', status: 'Hazır' },
        { device: 'Bariyer', status: 'Hazır' },
        { device: 'Uzaktan ödeme kontrolü', status: 'Hazır' },
      ],
    },
  },

  accounting: {
    eyebrow: 'Resmi Muhasebe',
    title: 'Resmi Muhasebe.',
    lead: 'Yazılım ve hizmetlerimiz sayesinde abonelik ve otopark gelirlerinizin e-Fatura ve e-Arşiv faturaları elektronik ortamda müşterilerinize ulaştırılır.',
    listLabel: 'Muhasebe kapsamı',
    list: ['Abonelik gelirleri', 'Otopark gelirleri', 'e-Fatura ve e-Arşiv (GİB)', 'Müşteriye elektronik iletim'],
    flowLabel: 'Elektronik fatura akışı',
    flow: ['Abonelik ve otopark geliri', 'e-Fatura / e-Arşiv', 'Müşteriniz'],
  },

  cta: {
    eyebrow: 'Yanınızdayız',
    title: 'Geleceğe Park Et.',
    description: 'Keşif, kurulum, 7/24 destek ve bakım hizmetleri için bizimle iletişime geçin.',
    primary: 'Hemen Başvur',
    secondary: 'Ücretsiz Online Keşif',
  },
}
