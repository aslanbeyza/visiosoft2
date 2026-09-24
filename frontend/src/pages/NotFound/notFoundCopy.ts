import type { ParkingFlowStep } from '../../components/ParkingFlow/index.ts'

export const notFoundCopy = {
  seoTitle: 'Sayfa bulunamadı - Visiosoft',
  eyebrow: 'Hata 404',
  title: 'Aradığınız sayfa bulunamadı.',
  lead: 'Adres değişmiş ya da sayfa kaldırılmış olabilir. Aşağıdaki bağlantılardan devam edebilirsiniz.',
  requestedLabel: 'İstenen adres',
  home: 'Ana sayfaya dönün',
  contact: 'İletişime geçin',
  sceneLabel: 'Bariyeri kapalı otopark şeridi: istenen sayfa bulunamadı',
  linksTitle: 'Buradan devam edebilirsiniz',
  sitemapPrompt: 'Aradığınızı bulamadınız mı?',
  sitemapLink: 'Site haritasına göz atın',

  steps: [
    { id: 'approach', title: 'Adres istendi', description: 'Tarayıcınız bu adresteki sayfayı istedi.' },
    { id: 'detect', title: 'Adres okundu', description: 'İstenen adres sitedeki sayfalar arasında arandı.' },
    { id: 'verify', title: 'Kayıt bulunamadı', description: 'Bu adrese ait bir sayfa yok; bariyer kapalı kalır.' },
  ] satisfies ParkingFlowStep[],
  links: [
    { route: 'home', title: 'Ana sayfa', description: "Visiosoft'un otopark çözümlerine genel bakış." },
    { route: 'hardware-products', title: 'Donanım', description: 'Kiosk, Visiobox, rack kabin ve kamera ekipmanları.' },
    { route: 'software-products', title: 'Park Yazılım', description: 'Otopark yazılımı, HGS ödeme ve kuş bakışı yönetim.' },
    { route: 'contact', title: 'İletişim', description: 'Sorularınız için ekibimize ulaşın.' },
  ],
}
