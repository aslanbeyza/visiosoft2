export type AlprNeed = {
  title: string
  linkLabel: string
  linkRoute: string
  icon: 'id' | 'chip' | 'headset'
  image: string
  imageAlt: string
  portrait?: boolean
}

export type AlprFlow = {
  title: string
  desc: string
  ctaLabel: string
  ctaRoute: string
  icon: 'search' | 'file' | 'gears'
}

export type AlprCopy = {
  metaTitle: string
  metaDescription: string
  eyebrow: string
  headline: string
  subtitle: string
  quote: string
  discovery: string
  contact: string
  whatsapp: string
  email: string
  needs: AlprNeed[]
  section2Title: string
  section2Intro: string
  section2Metrics: string[]
  proofTitle: string
  proofDesc: string
  proofLogos: { src: string; alt: string }[]
  demoTitle: string
  demoDesc: string
  demoImage: string
  demoImageAlt: string
  complianceTitle: string
  complianceItems: string[]
  faqTitle: string
  faqItems: { q: string; a: string }[]
  salesFlow: AlprFlow[]
  servicesLabel: string
  section3Title: string
  section3Desc: string
  whatsappMessage: string
}

const logos = [
  { src: '/referanslar/logolar/Crowne Plaza.png', alt: 'Crowne Plaza' },
  { src: '/referanslar/logolar/Metropark awm.png', alt: 'Metropark' },
  { src: '/referanslar/logolar/YTÜ.png', alt: 'YTÜ' },
  { src: '/referanslar/logolar/Vema Holding.png', alt: 'Vema Holding' },
  { src: '/referanslar/logolar/Intetra.png', alt: 'Intetra' },
  { src: '/referanslar/logolar/autopia.png', alt: 'Autopia' },
]

const _en: AlprCopy = {
  metaTitle: 'End-to-End Plate Recognition Sales Page | Visiosoft',
  metaDescription: 'Everything needed for parking operations: plate recognition software, hardware and continuous support.',
  eyebrow: 'END-TO-END PARKING SOLUTION',
  headline: 'To manage a parking operation, you need 3 things.',
  subtitle: 'We combine all three in one clear sales model.',
  quote: 'Get Quote',
  discovery: 'Free Discovery',
  contact: 'Contact',
  whatsapp: 'WhatsApp',
  email: 'Email',
  needs: [
    {
      title: 'Plate Recognition & Parking Automation Software',
      linkLabel: 'Learn More',
      linkRoute: 'alpr.index',
      icon: 'id',
      image: '/img/plaka-tanima-illustration.png',
      imageAlt: 'Plate recognition vehicle and barrier gate system',
    },
    {
      title: 'Cameras, Kiosk and Field Hardware',
      linkLabel: 'Hardware',
      linkRoute: 'hardware-products',
      icon: 'chip',
      image: '/img/kiosk-hardware-vertical.png',
      imageAlt: 'Self-service parking payment kiosk',
      portrait: true,
    },
    {
      title: 'Support & Monitoring',
      linkLabel: 'Support Details',
      linkRoute: 'services',
      icon: 'headset',
      image: '/img/destek.png',
      imageAlt: '24/7 support and monitoring team',
    },
  ],
  section2Title: 'From Discovery to Operations',
  section2Intro: 'A simple process to start quickly and operate safely.',
  section2Metrics: ['Fast discovery planning', 'Planned installation timeline', '24/7 monitoring & support'],
  proofTitle: 'Trusted by leading operators',
  proofDesc: 'Chosen by parking operators, municipalities and campuses.',
  proofLogos: logos.map((logo) => ({ ...logo, alt: 'Reference logo' })),
  demoTitle: 'Live system preview',
  demoDesc: 'See how plate capture, access control and reporting work together.',
  demoImage: '/img/otopark-cikis.jpeg',
  demoImageAlt: 'Parking exit camera view',
  complianceTitle: 'Security & compliance',
  complianceItems: ['KVKK-aligned data handling', 'Role-based access control', 'Audit-ready reporting'],
  faqTitle: 'Frequently asked questions',
  faqItems: [
    { q: 'How long does installation take?', a: 'Typical rollout is planned within days after discovery and schedule approval.' },
    { q: 'Do you work with existing cameras?', a: 'We can integrate with most IP camera models and recommend upgrades if needed.' },
    { q: 'What about maintenance and updates?', a: 'We monitor proactively and keep the system updated without downtime.' },
    { q: 'Is there a support SLA?', a: 'Yes, we provide guaranteed response times with 24/7 coverage.' },
    { q: 'Can we scale to multiple sites?', a: 'Yes, the platform is designed for multi-site management and reporting.' },
  ],
  salesFlow: [
    {
      title: 'Free Discovery',
      desc: 'We analyze your area and create a no-cost initial scope.',
      ctaLabel: 'Free Discovery',
      ctaRoute: 'discovery.show',
      icon: 'search',
    },
    {
      title: 'Quote & Contract (Online)',
      desc: 'Commercial terms are shared clearly and completed online.',
      ctaLabel: 'Get Quote',
      ctaRoute: 'quote.index',
      icon: 'file',
    },
    {
      title: 'Operations',
      desc: 'We go live, monitor and support your parking workflow continuously.',
      ctaLabel: 'Our Services',
      ctaRoute: 'services',
      icon: 'gears',
    },
  ],
  servicesLabel: 'Our Services',
  section3Title: 'Always Supported, Always Monitoring.',
  section3Desc: '100% uptime guarantee and 24/7 support.',
  whatsappMessage: 'Hello, I want information about your end-to-end plate recognition parking solution.',
}

const tr: AlprCopy = {
  metaTitle: 'Uçtan Uca Plaka Tanıma Satış Sayfası | Visiosoft',
  metaDescription: 'Otopark yönetimi için gereken her şey: plaka tanıma yazılımı, donanım ve sürekli destek.',
  eyebrow: 'UÇTAN UCA OTOPARK ÇÖZÜMÜ',
  headline: 'Otopark yönetmek için 3 şey gerekir.',
  subtitle: 'Bu üç bileşeni tek satış modeliyle birleştiriyoruz.',
  quote: 'Teklif Al',
  discovery: 'Ücretsiz Keşif',
  contact: 'İletişim',
  whatsapp: 'WhatsApp',
  email: 'E-posta',
  needs: [
    {
      title: 'Plaka Tanıma ve Otomasyon Yazılımı',
      linkLabel: 'Detaylı Bilgi',
      linkRoute: 'alpr.index',
      icon: 'id',
      image: '/img/plaka-tanima-illustration.png',
      imageAlt: 'Plaka tanıma ve bariyer geçiş sistemi',
    },
    {
      title: 'Kamera, Kiosk ve Diğer Donanım',
      linkLabel: 'Donanımlar',
      linkRoute: 'hardware-products',
      icon: 'chip',
      image: '/img/kiosk-hardware-vertical.png',
      imageAlt: 'Otopark ödeme kiosk terminali',
      portrait: true,
    },
    {
      title: 'Destek & Takip',
      linkLabel: 'Detaylı Bilgi',
      linkRoute: 'services',
      icon: 'headset',
      image: '/img/destek.png',
      imageAlt: '7/24 destek ve izleme ekibi',
    },
  ],
  section2Title: 'Keşiften Operasyona',
  section2Intro: 'Hızlı başlamak ve sürdürülebilir işletim için sade süreç.',
  section2Metrics: ['Hızlı keşif planlaması', 'Planlı kurulum takvimi', '7/24 izleme ve destek'],
  proofTitle: 'Önde gelen işletmelerin tercihi',
  proofDesc: 'Otopark işletmeleri, belediyeler ve kampüsler tarafından seçilir.',
  proofLogos: logos.map((logo) => ({ ...logo, alt: 'Referans logo' })),
  demoTitle: 'Canlı sistem önizleme',
  demoDesc: 'Plaka yakalama, geçiş kontrolü ve raporlamanın birlikte nasıl çalıştığını görün.',
  demoImage: '/img/otopark-cikis.jpeg',
  demoImageAlt: 'Otopark çıkış kamera görünümü',
  complianceTitle: 'Güvenlik ve uyumluluk',
  complianceItems: ['KVKK uyumlu veri yönetimi', 'Rol bazlı erişim kontrolü', 'Denetime hazır raporlama'],
  faqTitle: 'Sık Sorulan Sorular',
  faqItems: [
    { q: 'Kurulum ne kadar sürer?', a: 'Keşif ve planlama sonrası birkaç gün içinde net takvim çıkarılır.' },
    { q: 'Mevcut kameralarla çalışır mı?', a: 'Birçok IP kamera ile entegre olur, gerekiyorsa öneri sunarız.' },
    { q: 'Bakım ve güncellemeler nasıl olur?', a: 'Sürekli izleme ve kesintisiz güncelleme süreçleri yürütürüz.' },
    { q: 'Destek SLA var mı?', a: 'Evet, 7/24 destek ve garanti süreleri sunuyoruz.' },
    { q: 'Çoklu lokasyon için uygun mu?', a: 'Evet, platform çoklu lokasyon yönetimi için tasarlandı.' },
  ],
  salesFlow: [
    {
      title: 'Ücretsiz Keşif',
      desc: 'Sahanızı inceler, maliyetsiz ilk kapsamı netleştiririz.',
      ctaLabel: 'Ücretsiz Keşif',
      ctaRoute: 'discovery.show',
      icon: 'search',
    },
    {
      title: 'Teklif & Sözleşme (Online)',
      desc: 'Ticari şartlar şeffaf şekilde iletilir ve online tamamlanır.',
      ctaLabel: 'Teklif Al',
      ctaRoute: 'quote.index',
      icon: 'file',
    },
    {
      title: 'Operasyon',
      desc: 'Canlıya alır, otopark süreçlerinizi sürekli izler ve destekleriz.',
      ctaLabel: 'Hizmetlerimiz',
      ctaRoute: 'services',
      icon: 'gears',
    },
  ],
  servicesLabel: 'Hizmetlerimiz',
  section3Title: 'Sürekli Destek Garantisi',
  section3Desc: '%100 çalışma süresi garantisi ve 7/24 destek.',
  whatsappMessage: 'Merhaba, uçtan uca plaka tanıma otopark çözümünüz hakkında bilgi almak istiyorum.',
}

export function alprLandingCopy(): AlprCopy {
  return tr
}

void _en
